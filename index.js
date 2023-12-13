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

class HouseService {
  static url =
    "https://65772c23197926adf62d8e13.mockapi.io/Week12UnitFinalCodingProject";

  // get request for getting all of my stadiums
  static getAllStadiums() {
    let allStadiumsData = $.get(this.url);
    console.log("getting all the stadiums...", allStadiumsData);
    return allStadiumsData;
  }

  static getHouse(id) {
    return $.get(this.url + `/${id}`);
  }

  static createHouse(house) {
    return $.post(this.url, house);
  }

  static updateHouse(house) {
    return $.ajax({
      url: this.url + `/${house._id}`,
      dataType: "json",
      data: JSON.stringify(house),
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
  static houses;

  static getAllStadiums() {
    HouseService.getAllStadiums().then((houses) => this.render(houses));
  }

  static deleteStadium(id) {
    HouseService.deleteStadium(id)
      .then(() => HouseService.getAllStadiums())
      .then((houses) => this.render(houses));
  }

  static createHouse(name) {
    HouseService.createHouse(new House(name))
      .then(() => HouseService.getAllStadiums())
      .then((houses) => this.render(houses));
  }

  static addRoom(id) {
    for (let house of this.houses) {
      if (house._id == id) {
        house.concessions.push(
          new Room(
            $(`#${house._id}-room-name`).val(),
            $(`#${house._id}-room-area`).val()
          )
        );
        HouseService.updateHouse(house)
          .then(() => {
            return HouseService.getAllStadiums();
          })
          .then((houses) => this.render(houses));
      }
    }
  }

  static deleteRoom(houseId, roomId) {
    for (let house of this.houses) {
      if (house._id == houseId) {
        for (let room of house.concessions) {
          if (room._id == roomId) {
            house.concessions.splice(house.concessions.indexOf(room), 1);
            HouseService.updateHouse(house)
              .then(() => {
                return HouseService.getAllStadiums();
              })
              .then((houses) => this.render(houses));
          }
        }
      }
    }
  }

  //this renders multiple instances of the houses array
  static render(houses) {
    console.log("Houses render method:", houses);

    this.house = houses;
    $("#app").empty();
    for (let house of houses) {
      $("#app").prepend(
        html`<div id="$${house._id}" class="card">
            <div class="card-header">
              <h2>${house.stadiumName}</h2>
              <button
                class="btn btn-danger"
                onclick="DOMManager.deleteStadium('${house._id}')"
              >
                Delete
              </button>
            </div>
            <div class="card-body">
              <div class="card">
                <h3>Stadium Capacity: ${house.stadiumCapacity}</h3>
                <div class="row">
                  <div class="col-sm">
                    <!--beginning of room input  -->
                    <input
                      type="text"
                      id="${house._id}-concession-name"
                      class="form-control"
                      placeholder="Concession Name"
                    />
                    <!-- end of room input -->
                  </div>
                  <div class="col-sm">
                    <input
                      type="text"
                      id="${house._id}-concession-foods"
                      class="form-control"
                      placeholder="Concession Foods"
                    />
                  </div>
                </div>
                <button
                  id="${house._id}-new-room"
                  onclick="DOMManager.addRoom('${house._id}')"
                  class="btn btn-primary form-control"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <br />`
      );
      for (let room of house.concessions) {
        $(`#${house._id}`)
          .find(".card-body")
          .append(
            html`<p>
              <span id="name-${room._id}"
                ><strong>Name: </strong> ${room.name}</span
              >
              <span id="name-${room._id}"
                ><strong>Area: </strong> ${room.area}</span
              >
              <button
                class="btn btn-danger"
                onclick="DOMManager.deleteRoom('${house._id}', '${room._id}')"
              >
                Delete Room
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
