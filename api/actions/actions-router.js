// Write your "actions" router here!
// Write your "Actions" router here!
const router = require('express').Router()
const Actions = require('./actions-model')

router.get('/',(req,res) => {
    Actions.get(req.query)
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "The actions information could not be retrieved"
        })
    })
})

  router.get('/:id', (req, res) => {
    Actions.get(req.params.id)
      .then(actions => {
        if (actions) {
          res.status(200).json(actions);
        } else {
          res.status(404).json({ message: "The actions with the specified ID does not exist" });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message: "The Actions information could not be retrieved",
        });
      });
  });

  router.post('/', async (req, res) => {
    try{
        const actionsFromClient = req.body;
        if(!actionsFromClient.name || !actionsFromClient.description){
            res.status(400).json({
                message: "Please provide name and description for the project"
            })
        }else{
            const newAction = await Actions.insert(actionsFromClient)
            res.status(201).json(newAction)
        }
    }catch(err){
        res.status(500).json({
            message: "There was an error while saving the newAction to the database",
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
            const updatedActions = await Actions.update(id,{description, notes})
            if(!updatedActions){
                res.status(404).status({
                    message: "The project with the specified ID does not exist"
                })
            }else{
                res.status(200).json(updatedActions)
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
    Actions.remove(req.params.id)
    .then(deletedActions =>{ 
        if(!deletedActions){
            res.status(404).json({
                message: "The action with the specified ID does not exist"
            })
        }else{
            res.json(deletedActions)
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


module.exports = router;

