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

  addConcessions(concessionNameData, typeOfFoodData) {
    this.concessions.push(new Concession(concessionNameData, typeOfFoodData));
  }
}

class Concession {
  constructor(concessionNameData, typeOfFoodData) {
    this.concessionName = concessionNameData;
    this.typeOfFood = [];
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

  static updateStadium(stadium) {
    return $.ajax({
      url: this.url + `/${stadium._id}`,
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

  static deleteStadium(stadiumId) {
    StadiumService.deleteStadium(stadiumId)
      .then(() => StadiumService.getAllStadiums())
      .then((stadiums) => this.render(stadiums));
  }
  static deleteConcession(stadiumId, concessionId) {
    for (let stadium of this.stadiums) {
      if (stadium._id == stadiumId) {
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

  static createStadium(name) {
    StadiumService.createStadium(new Stadium(name))
      .then(() => StadiumService.getAllStadiums())
      .then((houses) => this.render(houses));
  }

  static addConcessions(id) {
    for (let stadium of this.stadiums) {
      if (stadium._id == id) {
        stadium.concessions.push(
          new Room(
            $(`#${stadium._id}-concessions-concessionsNameData`).val(),
            $(`#${stadium._id}-concessions-typeOfFoodData`).val()
          )
        );
        StadiumService.updateStadium(stadium)
          .then(() => {
            return StadiumService.getAllStadiums();
          })
          .then((stadium) => this.render(stadiums));
      }
    }
  }

  static deleteStadium(stadiumId, concessionId) {
    console.log("what is happening here", stadiumId);
    for (let stadium of this.stadiums) {
      if (stadium._id == stadiumId) {
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

  //this renders multiple instances of the houses array
  static render(stadiums) {
    console.log("Stadium render method:", stadiums);

    this.stadiums = stadiums;
    console.log(this.stadiums);
    console.log(stadiums[0].concessions[0].id);
    $("#app").empty();
    for (let stadium of stadiums) {
      $("#app").prepend(
        html`<div id="$${stadium._id}" class="card">
            <div class="card-header">
              <h2>${stadium.stadiumName}</h2>
              <button
                class="btn btn-danger"
                onclick="DOMManager.deleteStadium('${stadium._id}')"
              >
                Stadium Delete
              </button>
            </div>
            <div class="card-body">
              <div class="card">
                <h3>Stadium Capacity: ${stadium.stadiumCapacity}</h3>
                <div class="row">
                  <div class="col-sm">
                    <!--beginning of room input  -->
                    <input
                      type="text"
                      id="${stadium._id}-concession-name"
                      class="form-control"
                      placeholder="Concession Name"
                    />
                    <!-- end of room input -->
                  </div>
                  <div class="col-sm">
                    <input
                      type="text"
                      id="${stadium._id}-concession-foods"
                      class="form-control"
                      placeholder="Concession Foods"
                    />
                  </div>
                </div>
                <button
                  id="${stadium._id}-new-concession"
                  onclick="DOMManager.addConcession('${stadium._id}')"
                  class="btn btn-primary form-control"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <br />`
      );
      for (let concession of stadium.concessions) {
        $(`#${stadium._id}`)
          .find(".card-body")
          .append(
            html`<p>
              <span id="name-${concession._id}"
                ><strong>Name: </strong> ${concession.name}</span
              >
              <span id="name-${concession._id}"
                ><strong>Area: </strong> ${concession.typeOfFoodData}</span
              >
              <button
                class="btn btn-danger"
                onclick="DOMManager.deleteConcession('${stadium._id}', '${concession._id}')"
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
