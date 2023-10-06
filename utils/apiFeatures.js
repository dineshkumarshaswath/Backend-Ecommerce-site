class APIFeatures {
    constructor(query,queryStr){
       this.query=query;
       this.queryStr=queryStr
    }

    search(){
        let keyword=this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:'i'
            }
        }:{}

        this.query.find({...keyword})
        return this;
    }

    filter(){
        const queryStrCopy= {...this.queryStr};
        //console.log(queryStrCopy)

        const removeFields= ['keyword','limit','page']
        removeFields.forEach(fields=> delete queryStrCopy[fields])
        //console.log(removeFields)
        //console.log(queryStrCopy)

        let queryStr= JSON.stringify(queryStrCopy)

        queryStr=queryStr.replace(/\b(lt|gt|lte|gte)/g,match=>`$${match}`)
        
        //console.log(queryStr)
        //console.log(JSON.parse(queryStr))

        this.query.find(JSON.parse(queryStr))
        return this;
    }


    paginate(resPerpage){
        const currentpage=Number(this.queryStr.page)||1;
        const skip=resPerpage*(currentpage-1)
        this.query.limit(resPerpage).skip(skip)
         return this


    }

}


module.exports=APIFeatures