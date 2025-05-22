export default async function pagination(url,urlValue1, urlValue2) {

    
    function paginationNumber(page, lastPage, data1, data2) { 

        document.getElementById('paginationNumber').innerHTML = " ";

        let paginationHtml = `<ul id="pagination">`
        
            if (page > 1) {
                paginationHtml += `<li><a href="/${data1}/${data2}/?page=1" id="first" onclick="(${event => fn(event)})()"> << </a></li>`;
            }
        
            if (page > 1) {
            paginationHtml += `<li><a href="/${data1}/${data2}/?page=${parseInt(page) -1}" id="second" onclick="(${event => fn(event)})()"> ${parseInt(page) -1} </a></li>`
            }
        
            paginationHtml +=  `<li><a href="/${data1}/${data2}/?page=${page}" id="mid" onclick="(${event => fn(event)})()"> ${page} </a></li>`
        
            if (page < lastPage) {
                paginationHtml += `<li><a href="/${data1}/${data2}/?page=${parseInt(page) +1}" id="seclast" onclick="(${event => fn(event)})()"> ${parseInt(page) +1} </a></li>`
            }
        
            if (page < lastPage) {
                paginationHtml += `
                <li><a href="/${data1}/${data2}/?page=${lastPage}" id="last" onclick="(${event => fn(event)})()"> >> </a></li>`;
            }
        
        paginationHtml += `</ul>`
        
        document.getElementById('paginationNumber').innerHTML = paginationHtml
        paginationHtml = " "
        
        }
    

async function getTableData(url) {

    document.getElementById('user_table').innerHTML = ""


    let str = " "

    let respone = await fetch(url)

        const result = await respone.json();
    

        let currPage = result.data.currentpage;
        let totalpage = result.data.totalPage
    
            str += `<tr>`
            for(let [key, value] of Object.entries(result.data.results[0])){
                str += `<td> ${key} </td>`
            }
            str += `</tr>`
            
        

        for(let i=0; i < result.data.results.length;i++){

            str += `<tr>`

            for(let [key, value] of Object.entries(result.data.results[i])){

            str += `<td> ${value} </td>`
            
            }          
        }
        str += `</tr>`

        document.getElementById('user_table').innerHTML = str
        str = " "
        
        paginationNumber(currPage, totalpage,urlValue1,urlValue2)
    
      }

      async function fn(event) {
        event.preventDefault();
        
        let id = event.target.id
        
        if(id == 'first'){
          await  getTableData(event.target.href)
        }else if(id == 'second'){
          await  getTableData(event.target.href)
        }else if(id == 'mid'){    
          await  getTableData(event.target.href)
        }else if(id == 'seclast'){
           await getTableData(event.target.href)
        }else if(id == 'last'){
          await  getTableData(event.target.href)
        }
    }

    getTableData(url)
  
}

