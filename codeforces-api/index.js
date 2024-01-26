const express = require("express") ;
const axios = require("axios") ;
const cors = require('cors') ;

const app = express() ;

app.use(express.json()) ;
app.use(cors()) ;

app.get('/' , async (req,res)=>{  
    const username = "agdecoder03"
    //800 - 0.5 , increment + 0.5(on every 100 rating inc from 800)
    // for each contest give 2 points(just for giving the contest)

    //PENDING
    // score acoording to rank percentile(contest)
    // try streak logic -> streak
    // create a map -> (date , numberOfProblems)
    // give size of map in response
    // add current rating to score
    try {
    const data = await axios.get(` https://codeforces.com/api/user.status?handle=${username}`) ;
    const currRatingResponse = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`) ;
    let score = currRatingResponse.data.result[0].rating ;
    const arr = data.data.result;
    let uniqueProblems = new Set() ;
    let numberOfContests = new Set();

    // problems that are accepted
    const newArr = arr.filter((submission)=>{
        return (submission.verdict ==='OK') ;
    })
    for (let i = 0; i < newArr.length; i++) {

        score = score + ((newArr[i].problem.rating -700)/100 * 0.5 );
        const problemId = `${newArr[i].problem.contestId}${newArr[i].problem.index}`;
        if(newArr[i].author.participantType == "CONTESTANT") {
            numberOfContests.add(newArr[i].contestId) ;
        }
        uniqueProblems.add(problemId);
    }
    score += numberOfContests.size * 2 ;
    res.json({
        problemsSolved : uniqueProblems.size,
        score : Math.floor(score), 
        numberOfContests : numberOfContests.size,
        array : newArr 
    })
    }
    catch(e) {
        res.json({message : "Wrong username"})
    }
})

app.listen(3000);
