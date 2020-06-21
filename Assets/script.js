$(document).ready(function(){
  setInterval(function(){
    $("#currentDay").text(moment().format("dddd, MMMM Do YYYY, h:mm:ss A"));
  },1000);
  
  var workTimes = [moment().hours(9).minutes(0).seconds(0)];
  for(let i=0; i<=22; i++){
    var timeClone = workTimes[i].clone();
    timeClone.add(1, 'hours');
    workTimes[i+1] = timeClone;
  }
  // console.log(workTimes[0]._d.getHours());

  $.each(workTimes, function (index) {
    var timeRow = $("<div class='row time-block'>");
    var timeCol0 = $("<div class='col-2 hour'>");
    $(timeCol0).text(workTimes[index].format("h A"));
    var timeCol1 = $("<textarea class='col-8 description' placeholder='Type your activities for the hour...'>");
    var timeCol2 = $("<button class='col-2 saveBtn' style='font-size: 2.5rem'>");
    $(timeCol2).attr("id", "save"+workTimes[index]._d.getHours());
    $(timeCol1).val(timeGetText(workTimes[index]._d.getHours()));
    var saveFA = $("<i class='far fa-save'>");
    var timeCur = moment();
    if(moment(workTimes[index]).isBefore(timeCur) && workTimes[index]._d.getHours()!=timeCur._d.getHours()){
      $(timeCol1).addClass("past");console.log("past");
    }else if(moment(workTimes[index]).isAfter(timeCur)){
      $(timeCol1.addClass("future"));console.log("future");
    } else {
      $(timeCol1.addClass("present"));console.log("present");
    }
    $(timeCol2).append(saveFA);
    $(timeRow).append(timeCol0, timeCol1, timeCol2);
    $(".container-fluid").append(timeRow);
  });
  
  $("button").click(function(){
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

  function timeSaveText(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  };

  function timeGetText(key){
    value=JSON.parse(localStorage.getItem("save"+key));
      if(value!==null){
      return value;
    };
  }
})