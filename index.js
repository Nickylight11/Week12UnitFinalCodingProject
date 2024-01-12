/* 
   lit-html snippet - Begin
   Add to the top of your code. Works with html or jsx!
   Formats html in a template literal  using the lit-html library 
   Syntax: html`<div> html or jsx here! variable </div>`
*/
//lit-html snippet - Begin
let html = (strings, ...values) => {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (values[i] || "");
  });
  return str;
};
//lit-html snippet - End

//Used this class for each Stadium that is established in the
//app along with adding a concession
class Stadium {
  constructor(nameData) {
    this.stadiumName = nameData;
    this.stadiumCapacity = 0;
    this.concessions = [];
  }

  addConcession(concessionNameData, typeOfFoodData) {
    this.concessions.push(new Concession(concessionNameData, typeOfFoodData));
  }
}

//created this class to determine the stadium's maximum capacity
class Capacity {
  constructor(capacityNumberData) {
    this.capacity = capacityNumberData;
  }
}

//created this class to identify what concession is served at a
//particular stadium and the foods/drinks included in said concession.
class Concession {
  constructor(concessionNameData, typeOfFoodData) {
    this.concessionName = concessionNameData;
    this.typeOfFood = typeOfFoodData;
    // this.typeOfFood = typeOfFoodData;
  }
}

//created this class to generate information from MockAPI
class StadiumService {
  static url =
    "https://65772c23197926adf62d8e13.mockapi.io/Week12UnitFinalCodingProject";

  //get request for getting all of my stadiums
  static getAllStadiums() {
    let allStadiumsData = $.get(this.url);
    console.log("getting all the stadiums...", allStadiumsData);
    return allStadiumsData;
  }

  static getStadium(id) {
    return $.get(this.url + `/${id}`);
  }

  //used to create a new stadium at the top of the app
  static createStadium(stadium) {
    return $.post(this.url, stadium);
  }

  //used to establish capacity when creating a new stadium
  static createCapacity(Capacity) {
    return $.post(this.url, Capacity);
  }
  // static updateCapacity(stadiumId, newCapacity) {
  //   for (let stadium of this.stadiums) {
  //     if (id == stadiumId) {
  //       stadium.capacity = newCapacity;
  //     }
  //   }
  // }

  //used to add a concession and the foods at said concession
  static createConcession(concession, stadium) {
    console.log("creating concession...", concession);
    console.log("creating stadium...", stadium);

    return $.ajax({
      url: this.url + `/1`,
      dataType: "json",
      data: JSON.stringify(concession),
      contentType: "application/json",
      type: "PUT",
    });
    return $.post(this.url, concession)
      .done((data) => {
        console.log("Create Concession API Response:", data);
      })
      .fail((xhr, status, error) => {
        console.error("Create Concession API Request Failed:", status, error);
      })
      .always(() => {
        console.log("Create Concession API Request Completed");
      });
  }

  static updateStadium(stadium) {
    console.log("In updateStadium", stadium);
    //console.log(stadium.concessions);
    console.log("a url", this.url + `/${stadium.id}`);
    return $.ajax({
      url: this.url + `/${stadium.id}`,
      dataType: "json",
      data: JSON.stringify(stadium),
      contentType: "application/json",
      type: "PUT",
    });
  }

  //used to delete a stadium
  static deleteStadium(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: "DELETE",
    });
  }
}

//created to model a static screen of information, holding the stadiums,
//their capacity, concessions and foods
class DOMManager {
  static stadiums;
  static editStadium(stadiumId) {
    const newCapacity = prompt("Enter new stadium capacity:");
    if (newCapacity !== null && !isNaN(newCapacity)) {
      StadiumService.getStadium(stadiumId)
        .then((stadium) => {
          stadium.stadiumCapacity = parseInt(newCapacity);
          return StadiumService.updateStadium(stadium);
        })
        .then(() => StadiumService.getAllStadiums())
        .then((stadiums) => this.render(stadiums));
    }
  }
  static getAllStadiums() {
    StadiumService.getAllStadiums().then((stadiums) => this.render(stadiums));
  }

  //added a console log message to identify which particular
  //stadium would be set to be deleted
  static deleteStadium(stadiumId, stadiumName) {
    console.log("This stadium is set for deletion...", stadiumName);
    StadiumService.deleteStadium(stadiumId)
      .then(() => StadiumService.getAllStadiums())
      .then((stadiums) => this.render(stadiums));
    console.log(`${stadiumName} is deleted`);
  }

  //this class would be used to delete individual concessions within each stadium
  //onclick="DOMManager.deleteStadium(${stadium.id}, '${stadiumNameData}')"
  static deleteConcession(stadiumId, concessionId) {
    for (let stadium of this.stadiums) {
      if (stadium.id == stadiumId) {
        for (let concession of stadium.concessions) {
          if (concession.id == concessionId) {
            console.log("hello " + concession);
            //stadium.concessions.splice(
            //stadium.concessions.indexOf(concession),
            //1
            //);
            StadiumService.updateStadium(stadium)
              .then(() => {
                return StadiumService.getAllStadiums();
              })
              .then((stadiums) => this.render(stadiums));
          }
        }
      }
    }
  }

  //when creating a new stadium, the goal is to have the name of the
  //stadium and capacity be prompted for the user
  static createStadium(name, capacity) {
    const newStadium = new Stadium(name);
    newStadium.stadiumCapacity = capacity; //Set the capacity for the new stadium

    StadiumService.createStadium(newStadium)
      .then(() => StadiumService.getAllStadiums())
      .then((stadiums) => this.render(stadiums));
  }

  static createCapacity(number) {
    StadiumService.createCapacity(new Capacity(number))
      .then(() => StadiumService.getAllStadiums())
      .then((stadiums) => this.render(stadiums));
  }
  static updateCapacity(stadiumId, newCapacity) {
    for (let stadium of this.stadiums) {
      if (stadium.id == stadiumId) {
        stadium.stadiumCapacity = newCapacity;
        StadiumService.updateStadium(stadium);
      }
      this.render(this.stadiums);
    }
  }

  static createConcession(name, food) {
    console.log("create concession", "name data:", name, "food data:", food);
    StadiumService.createConcession(new Concession(name, food))
      .then(() => StadiumService.getAllStadiums())
      .then((concessions) => this.render(concessions));
  }
  static addConcession(stadiumId) {
    console.log("adding concessions...", stadiumId);
    for (let stadium of this.stadiums) {
      if (stadium.id == stadiumId) {
        console.log("concession found...", stadiumId);
        //Capture the new concession and capacity values from input fields
        const newConcession = new Concession(
          // .val help for button
          $(`#${stadiumId}-concession-name`).val(),
          $(`#${stadiumId}-concession-foods`).val()
        );
        console.log("text", newConcession);
        const newCapacity = $(`#${stadiumId}-stadium-capacity`).val();

        //Update the stadium properties
        stadium.concessions.push(newConcession);
        console.log("matts idea", stadium);
        stadium.stadiumCapacity = newCapacity;

        //Update the stadium on the server
        StadiumService.updateStadium(stadium)
          .then(() => StadiumService.getAllStadiums())
          .then((stadiums) => {
            console.log("StadiumService getAllStadiums", stadiums);
            return this.render(stadiums);
          });
      }
    }
  }

  //this renders multiple instances of the stadiums array
  static render(stadiums) {
    console.log("Stadium render method:", stadiums);
    //const newCapacity = $(`#${stadiumId}-stadium-capacity`).val();

    this.stadiums = stadiums;
    console.log(this.stadiums);
    console.log(stadiums[0].concessions[0].id);
    $("#app").empty();
    for (let stadium of stadiums) {
      let stadiumNameData = stadium.stadiumName;
      // console.log(stadiumNameData);

      //developed button for 'Delete Stadium'
      $("#app").prepend(
        html`<div id="${stadium.id}" class="card">
            <div class="card-header">
              <h2>${stadium.stadiumName}</h2>
              <button
                class="btn btn-danger"
                onclick="DOMManager.deleteStadium(${stadium.id}, '${stadiumNameData}')"
              >
                Delete Stadium
              </button>
            </div>
            <div class="card-body">
              <div>
                <h3>Stadium Capacity: ${stadium.stadiumCapacity}</h3>
                <input
                  type="text"
                  id="${stadium.id}-stadium-capacity"
                  class="form-control"
                  onclick="DOMManager.updateCapacity(${stadium.id}, $('#${stadium.id}-stadium-capacity').val())"
                />

                <!-- use this for capacity -->
                <button
                  class="btn btn-danger"
                  onclick="DOMManager.updateCapacity(${stadium.id}, newCapacity)"
                >
                  Edit Capacity
                </button>
              </div>
              <div class="row">
                <div class="col-sm">
                  <!--beginning of input  -->
                  <input
                    type="text"
                    id="${stadium.id}-concession-name"
                    class="form-control"
                    placeholder="Concession Name"
                  />
                  <!-- end of input -->
                </div>
                <div class="col-sm">
                  <input
                    type="text"
                    id="${stadium.id}-concession-foods"
                    class="form-control"
                    placeholder="Concession Foods"
                  />
                </div>
              </div>

              <!-- developed button for 'Add Concession' -->
              <button
                id="${stadium.id}-new-concession"
                onclick="DOMManager.createConcession($('#${stadium.id}-concession-name').val(),$('#${stadium.id}-concession-foods').val())"
                class="btn btn-primary form-control"
              >
                Add Concession
              </button>
              <!-- Display concessions -->
              <div class="concessions-container">
                <h4>Concessions:</h4>
                ${stadium.concessions.map(
                  (concession) =>
                    html` <div>${concession.concessionName}</div> `
                )}
              </div>
            </div>
          </div>
          <br />`
      );
      for (let concession of stadium.concessions) {
        // console.log("is this the solution?", concession);
        $(`#${stadium.id}`)
          .find(".card-body")
          .append(
            html`<p>
              <span id="name-${concession.id}"
                ><strong>Concession Name: </strong>
                ${concession.concessionName}</span
              >
              <span id="food-${concession.id}"
                ><strong>Foods: </strong> ${concession.typeOfFood}</span
              >
              <!--developed button for 'Delete Concession'-->
              <!-- XXXYYYZZZ -->
              <button
                class="btn btn-danger"
                onclick="DOMManager.deleteConcession('${stadium.id}', '${concession.id}')"
              >
                Delete Concession
              </button>
            </p>`
          );
      }
    }
  }
}

//used to display the new stadium name within the DOM once a stadium is created

$("#create-new-stadium").click(() => {
  DOMManager.createStadium($("#new-stadium-name").val());
  $("#new-stadium-name").val("");
});

DOMManager.getAllStadiums();
