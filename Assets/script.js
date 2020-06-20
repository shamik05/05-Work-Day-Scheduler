$(document).ready(function () {
  $("#currentDay").text(moment().format("MMMM Do YYYY, h:mm:ss a"));

  var workTimes = [9, 10, 11, 12, 1, 2, 3, 4, 5];
  console.log(workTimes);

  $.each(workTimes, function (index, value) {
    var timeRow = $("<div class='row time-block'>");
    var timeCol0 = $("<div class='col hour'>");
    timeCol0.text(value);
    var timeCol1 = $("<textarea class='col-8 description past'>");
    var timeCol2 = $("<button class='col-2 saveBtn' style='font-size: 2.5rem'>");
    var saveFA = $("<i class='far fa-save'>")
    $(timeCol2).append(saveFA);
    $(timeRow).append(timeCol0, timeCol1, timeCol2);
    $(".container-fluid").append(timeRow);
  });
});
