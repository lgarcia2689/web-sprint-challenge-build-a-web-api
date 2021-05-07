// Write your "projects" router here!
const router = require('express').Router()
const Projects = require('./projects-model')

router.get('/',(req,res) => {
    Projects.get(req.query)
    .then(projects => {
        res.status(200).json(projects);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "The projects information could not be retrieved"
        })
    })
})

router.get('/:id', (req, res) => {
    Projects.get(req.params.id)
      .then(projects => {
        if (projects) {
          res.status(200).json(projects);
        } else {
          res.status(404).json({ message: "The projects with the specified ID does not exist" });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message: "The projects information could not be retrieved",
        });
      });
  });

  router.post('/', async (req, res) => {
    try{
        const projectsFromClient = req.body;
        if(!projectsFromClient.name || !projectsFromClient.description){
            res.status(400).json({
                message: "Please provide title for the project"
            })
        }else{
            const newProject = await Projects.insert(projectsFromClient)
            res.status(201).json(newProject)
        }
    }catch(err){
        res.status(500).json({
            message: "There was an error while saving the project to the database",
          });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {description, notes} = req.body;
        if(!description||!notes){
            res.status(400).json({
                message: "Please provide description and notes for the project"
            })
        }else{
            const updatedProjects = await Projects.update(id,{description, notes})
            if(!updatedProjects){
                res.status(404).status({
                    message: "The project with the specified ID does not exist"
                })
            }else{
                res.status(200).json(updatedProjects)
            }
        }
      } catch (err) {
        res.status(500).json({
          error: "The project information could not be modified",
          message: err.message,
          stack: err.stack,
        })
      }
  });

  router.delete('/:id', (req, res) => {
    Projects.remove(req.params.id)
    .then(deletedProjects =>{ 
        if(!deletedProjects){
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }else{
            res.json(deletedProjects)
        }
    })
    .catch(err => {
      res.status(500).json({ 
              error: "The post could not be removed", 
              message: err.message,
              stack: err.stack
          })
    })
  })

  router.get('/:id/actions',(req,res) => {
    Projects.getProjectActions(req.params.id)
    .then(projects => {
      if (projects) {
        res.status(200).json(projects);
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "The comments information could not be retrieved"
        })
    })
  })


  module.exports = router;