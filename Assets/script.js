$(document).ready(function(){
  setInterval(function(){
    $("#currentDay").text(moment().format("[Today is] MMMM D, h:mm:ss A"));
  },1000);

  var timeList = [];
  for(let i=1; i<=12; i++){
    timeList.push("<option value="+i+">"+i+"</option>")
  };
  
  $("#startTime").append(timeList);
  $("#endTime").append(timeList);
  
  if(timeGetText("start")!=null){
    $("#startTime").val(timeGetText("start").slice(0,-2))
    $("#startAMPM").val(timeGetText("start").slice(-2))
    $("#endTime").val(timeGetText("end").slice(0,-2))
    $("#endAMPM").val(timeGetText("end").slice(-2))
  }
  
  function renderTimeslots(){
    $(".container-fluid").empty();
    // var workTimes = [moment().hours(9).minutes(0).seconds(0)];
    var workTimes = [moment(timeGetText("start"),"hA")];
    for(let i=0; i<=timeGetText("duration"); i++){
      var timeClone = workTimes[i].clone();
      timeClone.add(1, 'hours');
      workTimes[i+1] = timeClone;
    }

    $.each(workTimes, function (index) {
      var timeRow = $("<div class='row time-block'>");
      var timeCol0 = $("<div class='col hour'>");
      $(timeCol0).text(workTimes[index].format("ddd, hA"));
      var timeCol1 = $("<textarea class='col-8 description' placeholder='Type your activities for the hour...'>");
      var timeCol2 = $("<button class='col-2 saveBtn' style='font-size: 2.5rem'>");
      $(timeCol2).attr("id", "save"+workTimes[index]._d.getHours());
      $(timeCol1).val(timeGetText("save"+workTimes[index]._d.getHours()));
      var saveFA = $("<i class='far fa-save'>");
      var timeCur = moment();
      if(moment(workTimes[index]).isBefore(timeCur) && workTimes[index]._d.getHours()!=timeCur._d.getHours()){
        $(timeCol1).addClass("past linethrough");
      }else if(moment(workTimes[index]).isAfter(timeCur)){
        $(timeCol1.addClass("future font-italic"));
      } else {
        $(timeCol1.addClass("present underline"));
      }
      $(timeCol2).append(saveFA);
      $(timeRow).append(timeCol0, timeCol1, timeCol2);
      $(".container-fluid").append(timeRow);

    });
  }

  if(timeGetText("start")!=null){
    renderTimeslots();
  }

  $(".timeSetup").click(function(){
    var start = moment($("#startTime").val()+$("#startAMPM").val(),"hA");
    var end = moment($("#endTime").val()+$("#endAMPM").val(),"hA");
    if(start.isSame(end)){
      alert("The Start and End times are the same. Please enter a different time.")
    }else{
    // Copied from https://github.com/moment/moment/issues/1199#issuecomment-258647695
    if ( (start.hour() >=12 && end.hour() <=12 ) || end.isBefore(start) )
	  {
		end.add(1, "days");       // handle spanning days endTime
    }
    timeSaveText("start",$("#startTime").val()+$("#startAMPM").val())
    timeSaveText("duration",Math.abs(start.diff(end,"hours")))
    timeSaveText("end",$("#endTime").val()+$("#endAMPM").val())
    renderTimeslots();
    $("#timeModal").modal("hide");
    }
  })

  $(".col-2").click(function(){
    // console.log(this.id);
    let timeText = $(this).prev().val();
    // if(timeText === ""){
    //   alert($(this).prev().prev().text()+" Timeblock has no activities to save");
    //   return;
    // }
    // let saveBtnEl = this.id;
    timeSaveText(this.id, timeText);
    alert($(this).prev().prev().text()+" Timeblock saved successfully!")
  });

  $(".reset").click(function(){
    if(timeGetText("start")){
      if(confirm("Are you sure you wish to reset? Current schedule be lost!")){;
      localStorage.clear(); 
      $(".container-fluid").empty();
      }    
    }
  })

  function timeSaveText(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  };

  function timeGetText(key){
    value=JSON.parse(localStorage.getItem(key));
      if(value!==null){
      // console.log(value);
        return value;
    };
  }
})