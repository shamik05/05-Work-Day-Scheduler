$(document).ready(function () {
  $("#currentDay").text(moment().format("MMMM Do YYYY, h:mm:ss A"));
  
  var workTimes = [moment().hours(9).minutes(0).seconds(0)];
  for(let i=0; i<=15; i++){
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
    $(timeCol1).attr("id", "text"+workTimes[index]._d.getHours());
    var timeCol2 = $("<button class='col-2 saveBtn' style='font-size: 2.5rem'>");
    $(timeCol2).attr("id", "save"+workTimes[index]._d.getHours());
    var saveFA = $("<i class='far fa-save'>");
    $(timeCol2).append(saveFA);
    $(timeRow).append(timeCol0, timeCol1, timeCol2);
    $(".container-fluid").append(timeRow);
  });
  
  $("button").click(function(){
    // console.log(this.id);
    let x = $(this).prev().val();
    // console.log(x);
    localStorage.setItem(this.id, JSON.stringify($(this).prev().val()));
  })


});