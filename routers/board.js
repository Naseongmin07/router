const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const pool = mysql.createPool({
    host:"localhost",
    user:'root',
    password:'sksskdia',
    database: 'homepage',
    connectionLimit : 10,
    multipleStatements: true,
})



router.get('/list',(req,res)=>{
    page = req.query.page
    start = (page-1)*10
    pool.getConnection((error,connection)=>{
        if(error){
            console.log(error)
        }
        else{
            connection.query(`select idx, subject, board_name, content, date_format(today,"%Y-%m-%d") as today, hit from board order by idx desc limit ${start},10;`+
            'select count(*) as count from board;',(error,result)=>{
                connection.release()
                if(error){
                    console.log(error)
                }
                else{
                    count = result[1][0].count
                    board_length = count-(page-1)*10
                    result[0].forEach(v=>{
                        v.number = board_length
                        board_length--
                    })
                    if(page < Math.ceil(count/10)){
                        page_plus = parseInt(page)+1
                    }
                    else{
                        page_plus = page
                    }
                    
                    if(page>1){
                        page_minus = page-1
                    }
                    else{
                        page_minus = page
                    }
                    
                    grand_page = Math.ceil(page/10)
                    start = (grand_page-1)*100
                    if(grand_page*100>count){
                        end = count
                    }
                    else{
                        end = grand_page*100
                    }
                    
                    res.render('./board/list.html',{
                        list: result[0],
                        page : page,
                        page_plus : page_plus,
                        page_minus : page_minus, 
                        start:start,
                        end:end
                    })
                }
            })
        }
    })
})

router.get('/write',(req,res)=>{
    page = req.query.page
    res.render('./board/write.html',{
        page:page
    })
})

router.post('/write',(req,res)=>{
    subject = req.body.board_subject
    board_name = req.body.board_name
    content = req.body.board_content
    pool.getConnection((error,connection)=>{
        if(error){
            console.log(error)
        }
        else{
            connection.query(`insert into board (subject, board_name, content, hit) values('${subject}','${board_name}','${content}',0)`,(error,result)=>{
                connection.release()
                if(error){
                    console.log(error)
                }
                else{
                    console.log(result)
                    res.redirect(`/board/view?idx=${result.insertId}&page=1`)
                }
            })

        }
    })
})

router.get('/view',(req,res)=>{
    idx = req.query.idx
    page = req.query.page
    pool.getConnection((error,connection)=>{
        if(error){
            console.log(error)
        }
        else{
            connection.query(`update board set hit=hit+1 where idx=${idx}`,(error,result)=>{
                if(error){
                    console.log(error)
                }
                else{
                    console.log(result)
                }
            })
            connection.query(`select idx, subject, board_name, content, date_format(today,"%Y-%m-%d") as today, hit from board where idx=${idx}`,(error,result)=>{
                connection.release()
                if(error){
                    console.log(error)
                }
                else{
                    res.render('./board/view.html',{
                        list:result,
                        page:page
                    })
                }
            })
        }
    })
})

router.get('/update',(req,res)=>{
    idx = req.query.idx
    page = req.query.page
    pool.getConnection((error,connection)=>{
        if(error){
            console.log(error)
        }
        else{
            connection.query(`select idx, subject, board_name, content, date_format(today,"%Y-%m-%d") as today, hit from board where idx=${idx}`,(error,result)=>{
                connection.release()
                if(error){
                    console.log(error)
                }
                else{
                    console.log(result)
                    res.render('./board/update.html',{
                        list:result,
                        page : page
                    })
                }
            })    
        }
    })
})

router.post('/update',(req,res)=>{
    idx = req.query.idx
    page = req.query.page
    subject = req.body.board_subject
    board_name = req.body.board_name
    content = req.body.board_content
    pool.getConnection((error,connection)=>{
        if(error){
            console.log(error)
        }
        else{
            connection.query(`update board set subject = '${subject}', board_name = '${board_name}', content = '${content}' where idx=${idx}`,(error,result)=>{
                connection.release()
                if(error){
                    console.log(error)
                }
                else{
                    console.log(result)
                    res.redirect(`./list?page=${page}`)
                }
            })
        }
    })
})


router.get('/delete',(req,res)=>{
    idx = req.query.idx
    page = req.query.page
    pool.getConnection((error,connection)=>{
        if(error){
            console.log(error)
        }
        else{
            connection.query(`delete from board where idx=${idx}`,(error,result)=>{
                connection.release()
                if(error){
                    console.log(error)
                }
                else{
                    console.log(result)
                    res.redirect(`./list?page=${page}`)
                }
            })
        }
    })
})
module.exports = router;