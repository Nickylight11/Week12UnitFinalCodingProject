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

class Capacity {
  constructor(capacityNumberData) {
    this.capacity = capacityNumberData;
  }
}

class Concession {
  constructor(concessionNameData, typeOfFoodData) {
    this.concessionName = concessionNameData;
    this.typeOfFood = typeOfFoodData;
    // this.typeOfFood = typeOfFoodData;
  }
}

class StadiumService {
  static url =
    "https://65772c23197926adf62d8e13.mockapi.io/Week12UnitFinalCodingProject";

  // get request for getting all of my stadiums
  static getAllStadiums() {
    let allStadiumsData = $.get(this.url);
    console.log("getting all the stadiums...", allStadiumsData);
    return allStadiumsData;
  }

  static getStadium(id) {
    return $.get(this.url + `/${id}`);
  }

  static createStadium(stadium) {
    return $.post(this.url, stadium);
  }

  static createCapacity(Capacity) {
    return $.post(this.url, Capacity);
  }

  static createConcession(concession) {
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
    return $.ajax({
      url: this.url + `/${stadium.id}`,
      dataType: "json",
      data: JSON.stringify(stadium),
      contentType: "application/json",
      type: "PUT",
    });
  }

  static deleteStadium(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: "DELETE",
    });
  }
}

class DOMManager {
  static stadiums;

  static getAllStadiums() {
    StadiumService.getAllStadiums().then((stadiums) => this.render(stadiums));
  }

  static deleteStadium(stadiumId, stadiumName) {
    console.log("This stadium is set for deletion...", stadiumName);
    StadiumService.deleteStadium(stadiumId)
      .then(() => StadiumService.getAllStadiums())
      .then((stadiums) => this.render(stadiums));
    console.log(`${stadiumName} is deleted`);
  }

  // this class would be used to delete individual concessions within each stadium
  static deleteConcession(stadiumId, concessionId) {
    for (let stadium of this.stadiums) {
      if (stadium.id == stadiumId) {
        for (let concession of stadium.concessions) {
          if (concession._id == concessionId) {
            stadium.concessions.splice(
              stadium.concessions.indexOf(concession),
              1
            );
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

  static createStadium(name, capacity) {
    const newStadium = new Stadium(name);
    newStadium.stadiumCapacity = capacity; // Set the capacity for the new stadium

    StadiumService.createStadium(newStadium)
      .then(() => StadiumService.getAllStadiums())
      .then((stadiums) => this.render(stadiums));
  }

  static createCapacity(number) {
    StadiumService.createCapacity(new Capacity(number))
      .then(() => StadiumService.getAllStadiums())
      .then((stadiums) => this.render(stadiums));
  }

  static createConcession(name) {
    StadiumService.createConcession(new Concession(name))
      .then(() => StadiumService.getAllStadiums())
      .then((concessions) => this.render(concessions));
  }
  static addConcession(stadiumId) {
    for (let stadium of this.stadiums) {
      if (stadium.id == stadiumId) {
        // Capture the new concession and capacity values from input fields
        const newConcession = new Concession(
          $(`#${stadiumId}-concession-name`).val(),
          $(`#${stadiumId}-concession-foods`).val()
        );
        const newCapacity = $(`#${stadiumId}-stadium-capacity`).val();

        // Update the stadium properties
        stadium.concessions.push(newConcession);
        stadium.stadiumCapacity = newCapacity;

        // Update the stadium on the server
        StadiumService.updateStadium(stadium)
          .then(() => StadiumService.getAllStadiums())
          .then((stadiums) => this.render(stadiums));
      }
    }
  }

  //this renders multiple instances of the houses array
  static render(stadiums) {
    console.log("Stadium render method:", stadiums);

    this.stadiums = stadiums;
    console.log(this.stadiums);
    console.log(stadiums[0].concessions[0].id);
    $("#app").empty();
    for (let stadium of stadiums) {
      let stadiumNameData = stadium.stadiumName;
      console.log(stadiumNameData);

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
              <h3>Stadium Capacity: ${stadium.stadiumCapacity}</h3>
              <div class="row">
                <div class="col-sm">
                  <!--beginning of room input  -->
                  <input
                    type="text"
                    id="${stadium.id}-concession-name"
                    class="form-control"
                    placeholder="Concession Name"
                  />
                  <!-- end of room input -->
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
              <button
                id="${stadium.id}-new-concession"
                onclick="DOMManager.addConcession('${stadium.id}')"
                class="btn btn-primary form-control"
              >
                Add Concession
              </button>
              <!-- Display concessions -->
              <div class="concessions-container">
                <h4>Concessions:</h4>
                ${stadium.concessions.map((concession) => html``)}
              </div>
            </div>
          </div>
          <br />`
      );
      for (let concession of stadium.concessions) {
        $(`#${stadium.id}`)
          .find(".card-body")
          .append(
            html`<p>
              <span id="name-${concession._id}"
                ><strong>Concession Name: </strong>
                ${concession.concessionName}</span
              >
              <span id="name-${concession._id}"
                ><strong>Foods: </strong> ${concession.typeOfFoodData}</span
              >
              <button
                class="btn btn-danger"
                onclick="DOMManager.deleteConcession('${stadium.id}', '${concession._id}')"
              >
                Delete Concession
              </button>
            </p>`
          );
      }
    }
  }
}

$("#create-new-stadium").click(() => {
  DOMManager.createStadium($("#new-stadium-name").val());
  $("#new-stadium-name").val("");
});

DOMManager.getAllStadiums();
