$(document).ready(function () {
  $("#currentDay").text(moment().format("MMMM Do YYYY, h:mm:ss A"));

  // var workTimes = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // console.log(workTimes);
  // var x = moment().hours(9)
  // .format("h A");
  // var y = moment.duration(1, 'hours');
  
  var workTimes = [moment().hours(9).minutes(0).seconds(0)];
  for(let i=0; i<=15; i++){
    var timeClone = workTimes[i].clone();
    timeClone.add(1, 'hours');
    workTimes[i+1] = timeClone;
  }
  console.log(workTimes);
  
  // var x = test[0].clone();
  // x .add(1, 'hours');
  // test[1] = x
  // console.log(test);
  // console.log(x);
  // console.log(x._d.getHours());
  // console.log(x.add(1, 'hours'));
  // console.log(x._d.getHours());
  

  $.each(workTimes, function (index) {
    var timeRow = $("<div class='row time-block'>");
    var timeCol0 = $("<div class='col hour'>");
    timeCol0.text(workTimes[index].format("h A"));
    var timeCol1 = $("<textarea class='col-8 description past'>");
    var timeCol2 = $("<button class='col-2 saveBtn' style='font-size: 2.5rem'>");
    var saveFA = $("<i class='far fa-save'>")
    $(timeCol2).append(saveFA);
    $(timeRow).append(timeCol0, timeCol1, timeCol2);
    $(".container-fluid").append(timeRow);
  });
});
