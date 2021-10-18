
var LoadedTableData;
function toggle(ID){
var element = document.getElementById('tb1');
if(element.style.display === "none"){
    element.style.display = "inline";
}else{
    element.style.display = "none";
}
}

function getTableDetails() {
    var url = 'http://127.0.0.1:5000/classrooms/?query={tables(dbo:"'+
            $("#fdb").val() + '",user:"' +
            $("#fname").val() + '",pswd:"' +
            $("#fpassword").val() +'")'+
              '{tname}}';
    //console.log(url);
    $.ajax({
      url: url,
      type: 'GET',
      success: function(response) {
        var tabledata = response.data.tables;
        if(tabledata == null)
        {
          alert("Please enter proper credentials for db")
        }
        else{
        LoadedTableData = tabledata;
        var htmlCode = "<table style="+"width: auto;"+">"

        for (var i=0; i<tabledata.length; i++)
        {
        htmlCode +=
        "<tr><td>"+"<div id = dbtable"+i+" >"+tabledata[i].tname+"</div>"+"</td><td><select name="+"plan"+i+" id="+"plan"+i+"><option value="+"0"+" selected>0</option><option value="+"1"+">1</option><option value="+"2"+">2</option></select></td></tr>"
        }
        htmlCode += "</table>"
        if(tabledata.length>=0)
        {
            htmlCode += "<table><tr><td><button type="+"button"+" onclick="+"getSkelletons()" +">Get Skeletons</button></td><td><button type="+"button"+" onclick="+"reseteverything()" +">Reset Skeletons</button></td></tr></table>"
        }

        $("#tb2").html(htmlCode);
      }
      },
      error: function(error) {
        alert("ERROR");
       console.log(error);
      }
    });
  };

  
  function getSkelletons(){

    var htmlCode = "<table>"

    for(var i=0;i<LoadedTableData.length;i++)
    {
      var catch_selection = $("#plan"+i).val();
      //console.log($("#plan"+i).val());
      if($("#plan"+i).val()>0)
      {
       // console.log($("#fdb").val());
        var url = 'http://127.0.0.1:5000/classrooms/?query={columns(dbo:"'+
            $("#fdb").val() + '",user:"' +
            $("#fname").val() + '",pswd:"' +
            $("#fpassword").val() +'",dtable:"' +
            document.getElementById('dbtable'+i).innerHTML+'")'+
              '{cname dtype}}';
            // console.log(document.getElementById("dbtable"+i).innerHTML);
             var catch_tableName = document.getElementById("dbtable"+i).innerHTML;
              $.ajax({
                url: url,
                async:false,
                type: 'GET',
                success: function(response) {
                  var coloumndata = response.data.columns;
                 // console.log(i);
                 if(coloumndata == null)
                 {
                   alert("Please enter proper details inside the skeletons")
                 }
                 else
                 {
                    
                   for(var j=0;j<catch_selection;j++)
                   {
                    htmlCode+=    "<tr><td><table id = "+catch_tableName+"_"+j+" border="+1+"><tr><td>"+catch_tableName+"</td>"
                    for(var k=0 ; k< coloumndata.length;k++)
                    {
                     // console.log(coloumndata[k].cname);
                     // console.log(coloumndata[k].dtype);

                      htmlCode+= "<td>"+coloumndata[k].cname+"("+coloumndata[k].dtype+")"+"</td>"
                    }
                    htmlCode += "</tr><tr>"
                    for(var k=0 ; k<=coloumndata.length;k++)
                    {
                      if(k==0)
                      htmlCode+="<td><input type="+"text"+" id="+catch_tableName+"_"+j+"."+catch_tableName+" name="+catch_tableName+"_"+j+"."+catch_tableName+" style="+"width: auto;"+"></input></td>"
                      else
                      htmlCode+="<td><input type="+"text"+" id="+catch_tableName+"_"+j+"."+coloumndata[k-1].cname+" name="+catch_tableName+"_"+j+"."+coloumndata[k-1].cname+" style="+"width: auto;"+"></input></td>"
                    }
                    
                    htmlCode += "</tr></table></td></tr>"
                   }
                  
                   htmlCode+="</table>"
                   

                  // console.log(htmlCode);
                   $("#QbeSkeletons").html(htmlCode);
                  }
                   },
                   
      error: function(error) {
        alert("ERROR");
        console.log(error);
        }
        
      });
      
       }
      
    }

    var element = document.getElementById('conditionLabel');
    var element1 = document.getElementById('conditionBox');
    var element2 = document.getElementById('runQueryButton');
    if(element.style.display == "none" && element1.style.display == "none" && element2.style.display == "none"){
        element.style.display = "inline";
        element1.style.display = "inline";
        element2.style.display = "inline";
    }
    
  }

  function get_results()
  {
     var tabparams = [];
     var colparams = [];
     var condparams = document.getElementById('conditionBox').value;

     
    $('#QbeSkeletons').each(function(){
      $(this).find('tbody').each(function(){
        $(this)
          //do your stuff, you can use $(this) to get current cell
          $(this).find('tr').each(function(){
            $(this);
            $(this).find('td').each(function(){
              $(this);
              $(this).find('table').each(function(){
                $(this);
                $(this).find('tbody').each(function(){
                  $(this);
                  $(this).find('tr').each(function(){
                    $(this);
                    $(this).find('td').each(function(){
                      $(this).find('input').each(function(){
                      tabparams.push( $(this).attr("id"));
                      if(/[Pp][.]/.test(document.getElementById($(this).attr("id")).value))
                      {
                        colparams.push(document.getElementById($(this).attr("id")).value);
                      }
                      else if(/([Pp][\.])?[_][a-zA-Z]+?/.test(document.getElementById($(this).attr("id")).value))
                      {
                        colparams.push(document.getElementById($(this).attr("id")).value);
                      }
                      else if(
                      /['][\s\S]+[']/.test(document.getElementById($(this).attr("id")).value)==true ||
                       /\d+/.test('"'+document.getElementById($(this).attr("id")).value) || 
                       document.getElementById($(this).attr("id")).value=="" || 
                       /[Pp][.]/.test(document.getElementById($(this).attr("id")).value))
                      {
                      
                        colparams.push(document.getElementById($(this).attr("id")).value);
                      
                      }
                      else
                      {
                        alert("Please check the datatypes which were entered, notations to follow for string 'any string'")
                      }
                      
                      })
                    })
                  })
                })

              })

            })

          })
      })
  })

  console.log(tabparams);
  console.log(colparams);

  var url = 'http://127.0.0.1:5000/classrooms/?query={qbe(dbo:"'+
  $("#fdb").val() + '",user:"' +
  $("#fname").val() + '",pswd:"' +
  $("#fpassword").val() +'",tabparams:' +'["' +
  tabparams.join('","') +'"]'+ ',colparams:' + '["'+
  colparams.join('","') +'"]'+ ',condparams:"' +
  condparams +'")' +
  '{sqlq , qresult}}';

  //console.log(url);



  $.ajax({
    url: url,
    async : false,
    type: 'GET',
    success: function(response) {

      var querydata = response.data.qbe;
      if(querydata == null)
      {
        alert("Please enter proper details , check datatypes which you entered and follow qbe nominations")
      }
      else{
      htmlcode = "<lable>"+querydata[0].sqlq+"</label>";
      console.log(querydata[0].sqlq);
      var coloumnarray = querydata[0].sqlq.split(" ")[1].split(",");
      $('#sqlquery').html(htmlcode);
       htmlcode1 = "<table border = "+1+">"
       htmlcode1+= "<tr>"
       for(k=0;k<coloumnarray.length;k++)
       {
         htmlcode1+="<td>"+coloumnarray[k]+"</td>"
       }
       htmlcode1 += "</tr>"
      for(i=0;i<querydata.length;i++)
      {
        htmlcode1 += "<tr>"
        for(j=0;j<querydata[i].qresult.length;j++)
        {
          htmlcode1 += "<td>"+querydata[i].qresult[j]+"</td>"
        }
        htmlcode1 += "</tr>"
      }
      htmlcode1+="</table>"

      $('#tb3').html(htmlcode1);
    }
  
  }

})
  }

function reseteverything(){

  $('#tb3').html("<table style="+"width: auto;"+"></table>");
  $('#sqlquery').html("<label></label>");
  $('#QbeSkeletons').html("<table></table>");

  var element = document.getElementById('conditionLabel');
  var element1 = document.getElementById('conditionBox');
  var element2 = document.getElementById('runQueryButton');
  if(element.style.display == "inline" && element1.style.display == "inline" && element2.style.display == "inline"){
      element.style.display = "none";
      element1.style.display = "none";
      element2.style.display = "none";
  }

  getTableDetails();  

}