export const generateSelect=(cResult, oResult)=> {
    let str1 =`<select name="${cResult}" id="${cResult}" onchange="check(this)">`
    let str2 = `<option value=''>${cResult}</option>`
    for (let i = 0; i < oResult.length; i++) {
      let temp = `<option value="${oResult[i]["name"]}">${oResult[i]["name"]}</option>`;
      str2 += temp;
    }
    let str3 = `</select>`;
    return str1 + str2 + str3;
  }