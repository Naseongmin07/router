const express =require('express');
const router = express.Router(); // -- APP



router.get('/',(req,res)=>{
    res.render('index.html',{
        title:'homepage'
    })
})

module.exports = router;

