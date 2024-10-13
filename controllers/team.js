const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Team = require('../models/team');
const Time = require('../models/time')
const verifyToken = require('../middleware/verify-token');

//create team
router.post('/newteam/:userId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            res.status(400).json({error: 'No user found.'});         
        }
        const team = await Team.create({
            teamName: req.body.teamName,
            coaches: [user._id]
        })
        user.teams.push(team._id);
        await user.save()
        res.json({ user, team });
    } catch (error) {
        if (res.statusCode === 400) {
            res.status(400).json({error: error.message});
        } else {
            res.status(500).json({error: error.message});
        }
    }
});

//get all users by team
router.get('/gettimes/:teamId/:gameId', verifyToken, async (req, res) => {
    try {
        //get a list of users with teamId
        const team = await Team.findById(req.params.teamId)
        console.log('team', team)
        const teamUsers = await User.find({_id: { $in: team.members}})
        //loop throu reults build array of user ids
        const userData = []
        teamUsers.map((user) => {   
            //get all times with userids        
        //const userData = {
        // id: userId
        // name: ''
        //}
            console.log("user", user)    
            userData.push({'id' : user._id, 'name': user.username})          
        })
        const trackData = {}
        const blankTrack = {}
        
       
        const times =  await Time.find({'user': { $in: team.members}, 'game': req.params.gameId})
        teamUsers.map((user) => {
            //loop through all users for each user add blankTrack: { userId: null }
            blankTrack[user._id] = null
            
        })
        
        //loop through all the times
        times.map((time) => {
            
            if (!trackData.hasOwnProperty(time.trackName)) {
                //does track data have this track if no create obj with key of trackName and value of blankTrack object
                trackData[time.trackName] = blankTrack
                
                
            }
            //add users time to this idividual track 
            trackData[time.trackName][time.user]= time.time                
        })
        const trackDataArray = Object.entries(trackData).map(([key, value]) => {
            return { id: key, ...value };
          });
            
        // console.log(trackData)       
        res.json({'userdata': userData, 'trackData': trackData})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})


//Get One team
router.get('/:teamId', async (req, res) => {
    try {
        
        const team = await Team.findById(req.params.teamId).populate('coaches').populate('games').populate('members')
        res.status(200).json({ team })
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
});



//Edit team
router.put('/:teamId/edit', verifyToken, async (req, res) => {
    try {
        const updatedTeam = await Team.findByIdAndUpdate(
            req.params.teamId, 
            req.body, 
            {new: true})
            res.json(updatedTeam )
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
});

//Delete team
router.delete('/:teamId', verifyToken, async (req, res) => {
    try {
        const deletedTeam = await Team.findByIdAndDelete(req.params.teamId)
        res.json(deletedTeam)
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
});

module.exports = router;