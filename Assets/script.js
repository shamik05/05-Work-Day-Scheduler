$(document).ready(function(){
  // Function to update clock on Title
  setInterval(function(){
    $("#currentDay").text(moment().format("[Today is] MMMM D, h:mm:ss A"));
  },1000);

  // Function to check if the color scheme needs to be changed based on rerunning the Main function
  setInterval(function(){
    if(timeGetText("start")!=null){
      renderTimeslots();
      console.log("ran");
    }
  },60000);

  // Dataset Array to populate time values for setting work times
  var timeList = [];
  for(let i=1; i<=12; i++){
    timeList.push("<option value="+i+">"+i+"</option>")
  };
  
  $("#startTime").append(timeList);
  $("#endTime").append(timeList);
  
  // If work times have been saved in local storage then get them and set them as default values for the modal timeslots
  if(timeGetText("start")!=null){
    $("#startTime").val(timeGetText("start").slice(0,-2))
    $("#startAMPM").val(timeGetText("start").slice(-2))
    $("#endTime").val(timeGetText("end").slice(0,-2))
    $("#endAMPM").val(timeGetText("end").slice(-2))
  }
  
  // Main function to show timeslots
  function renderTimeslots(){
    // Empty our current page
    $(".container-fluid").empty();
    // var workTimes = [moment().hours(9).minutes(0).seconds(0)];
    // Create an array of moment objects starting with the given start time with increments of 1 hour
    var workTimes = [moment(timeGetText("start"),"hA")];
    // Duration is calculate from start and end time
    for(let i=0; i<=timeGetText("duration"); i++){
      // moment is a mutable object that needs to be cloned otherwise it will alter the original's value during manipulation
      var timeClone = workTimes[i].clone();
      timeClone.add(1, 'hours');
      workTimes[i+1] = timeClone;
    }

    // Create the gui based on the Moment array above
    $.each(workTimes, function (index) {
      // Row
      var timeRow = $("<div class='row time-block'>");
      // Column 1 showing the time slot
      var timeCol0 = $("<div class='col hour'>");
      // Display the moment object itself with some formatting
      $(timeCol0).text(workTimes[index].format("ddd, hA"));
      // Column 2 showing the text area
      var timeCol1 = $("<textarea class='col-8 description' placeholder='Type your activities for the hour...'>");
      // Column 3 showing the save button
      var timeCol2 = $("<button class='col-2 saveBtn' style='font-size: 2.5rem'>");
      // Assigning every save button an id so we can work with it later
      $(timeCol2).attr("id", "save"+workTimes[index]._d.getHours());
      // Grabbing any saved text for that timeslot by specifying under which savebutton it was saved as
      $(timeCol1).val(timeGetText("save"+workTimes[index]._d.getHours()));
      var saveFA = $("<i class='far fa-save'>");

      // Formatting the colors based on past, current, and future
      // Create a Moment object based on current time of calculation
      var timeCur = moment();
      // Check if the Moment object is earlier than our current time and that it does not equal our current hour either
      if(moment(workTimes[index]).isBefore(timeCur) && workTimes[index]._d.getHours()!=timeCur._d.getHours()){
        $(timeCol1).addClass("past");
      // Check if the Moment object is after our current time
      }else if(moment(workTimes[index]).isAfter(timeCur)){
        $(timeCol1.addClass("future"));
      // Assign a present color scheme otherwise
      } else {
        $(timeCol1.addClass("present"));
      }

      // Append the created divs above into their own Row and the Row to the container
      $(timeCol2).append(saveFA);
      $(timeRow).append(timeCol0, timeCol1, timeCol2);
      $(".container-fluid").append(timeRow);

    });
  }

  // If user has specified a start time then retrieve it and run the main function
  if(timeGetText("start")!=null){
    renderTimeslots();
  }

  // Eventlistener for worktimes button. Grab the start and end values including their respective AM/PM and make a moment object with it
  $(".timeSetup").click(function(){
    console.log(startTime)
    var start = moment($("#startTime").val()+$("#startAMPM").val(),"hA");
    var end = moment($("#endTime").val()+$("#endAMPM").val(),"hA");
    // Minor error checking to see if they specified the same start and end time
    if(start.isSame(end)){
      alert("The Start and End times are the same. Please enter a different time.")
    }else{
    // I needed help here in case the user specified a start time of 1AM and end time of 12AM. The computer calculates it with a duration of 1 hour 
    // when it should be 23. Computer has no way to know we are specifying a time ahead of our start time
    // Copied from https://github.com/moment/moment/issues/1199#issuecomment-258647695
    if ( (start.hour() >=12 && end.hour() <=12 ) || end.isBefore(start) )
	  {
		end.add(1, "days");       // handle spanning days endTime
    }
    // Save start, duration(absolute) and end values
    timeSaveText("start",$("#startTime").val()+$("#startAMPM").val())
    timeSaveText("duration",Math.abs(start.diff(end,"hours")))
    timeSaveText("end",$("#endTime").val()+$("#endAMPM").val())
    // Run the timeblock function
    renderTimeslots();
    // Close modal
    $("#timeModal").modal("hide");
    }
  })

  // Eventlistener on the save button
  $(".col-2").click(function(){
    // console.log(this.id);
    // Grab the text from the same row as the save button
    let timeText = $(this).prev().val();
    // if(timeText === ""){
    //   alert($(this).prev().prev().text()+" Timeblock has no activities to save");
    //   return;
    // }
    // let saveBtnEl = this.id;
    // Save it in localstorage with a key same as save button element id
    timeSaveText(this.id, timeText);
    alert($(this).prev().prev().text()+" Timeblock saved successfully!")
  });

  // Clear localstorage and reset timerows
  $(".reset").click(function(){
    if(timeGetText("start")){
      if(confirm("Are you sure you wish to reset? Current schedule be lost!")){;
      localStorage.clear(); 
      $(".container-fluid").empty();
      }    
    }
  })

  // Localstorage save function 
  function timeSaveText(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Localstorage get function
  function timeGetText(key){
    value=JSON.parse(localStorage.getItem(key));
      if(value!==null){
      // console.log(value);
        return value;
    };
  }
})