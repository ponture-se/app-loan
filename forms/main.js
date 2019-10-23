var usageObj = [
  {
    API_Name: "hire_staff",
    Label: "Anställa personal",
    isDefault: false
  },
  {
    API_Name: "acquisitions_purchase",
    Label: "Förvärv Köp",
    isDefault: false
  },
  {
    API_Name: "expansion",
    Label: "Expansion",
    isDefault: false
  },
  {
    API_Name: "finance_debts",
    Label: "Finansiera skulder",
    isDefault: false
  },
  {
    API_Name: "pay_off_debts",
    Label: "Betala av skulder",
    isDefault: false
  },
  {
    API_Name: "purchase_renting_equipment",
    Label: "Köp / hyra utrustning",
    isDefault: false
  },
  {
    API_Name: "purchase_of_business",
    Label: "Inköp av företag",
    isDefault: false
  },
  {
    API_Name: "purchase_of_inventory",
    Label: "Köp av lager",
    isDefault: false
  },
  {
    API_Name: "real_estate_financing",
    Label: "Fastighetsfinansiering",
    isDefault: false
  },
  {
    API_Name: "renovation",
    Label: "Renovering",
    isDefault: false
  },
  {
    API_Name: "renting_office",
    Label: "Hyra kontor",
    isDefault: false
  },
  {
    API_Name: "seasonal_financing",
    Label: "Säsongsfinansiering",
    isDefault: false
  },
  {
    API_Name: "unexpected_expenses",
    Label: "Oväntade utgifter",
    isDefault: false
  },
  {
    API_Name: "marketing",
    Label: "Marknadsföring",
    isDefault: false
  },
  {
    API_Name: "general_liquidity",
    Label: "Generell likviditet",
    isDefault: true
  },
  {
    API_Name: "other",
    Label: "Övrigt",
    isDefault: false,
    writable: true
  }
];
var priceStepsObj = [
  { from: 100000, to: 500000, step: 20000 },
  { from: 500000, to: 3000000, step: 50000 },
  { from: 3000000, to: 7000000, step: 100000 },
  { from: 7000000, to: 10000000, step: 125000 }
];
//data
var optionsArr = ["general_liquidity"];
// array prototype remove/////////////////////////////////////////////////////////////////

var activeUsages = document.querySelectorAll(".usageBtn.--active");
var usageBtns = document.getElementsByClassName("usageBtn");

var priceRange = new rangeSlider("priceRange", priceStepsObj, function(price) {
  price = price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
  document.querySelector("#priceRange .loanAmountValue").innerText =
    price + " kr";
});

var monthRange = new rangeSlider(
  "monthRange",
  [{ from: 1, to: 36, step: 1 }],
  function(month) {
    if (month === "36") month = "+36 månader";
    else if (parseInt(month) === 1) month = month + " månad";
    else month = month + " månader";
    document.querySelector("#monthRange .loanAmountValue").innerText = month;
  }
);

//functions
function toggleOption(e, callback) {
  e.classList.toggle("--active");
  var activeUsages = document.querySelectorAll(".usageBtn.--active");
  var defaultOption = document.getElementsByClassName("-defaultOption");
  var selected = e.classList.contains("--active");
  if (e.classList.contains("-writable") && selected) {
    document.getElementById("otherOption_input").style.display = "block";
  } else if (e.classList.contains("-writable") && !selected) {
    document.getElementById("otherOption_input").style.display = "none";
  }
  selectDefaultOption(activeUsages, defaultOption);
  if (typeof callback === "function") callback(e, selected);
}
function selectDefaultOption(activeOptions, defaultOptionDOM) {
  if (activeOptions.length === 0) {
    defaultOptionDOM[0].click();
  }
}
function fillUsageOptions(optionsObj) {
  var optionsContainer = document.querySelector("#usageOptions .options");
  for (var i = 0; i < optionsObj.length; i++) {
    var parent = document.createElement("div");
    var name_attr = document.createAttribute("name");
    var child = document.createElement("div");

    child.innerText = optionsObj[i].Label;
    name_attr.value = optionsObj[i].API_Name;
    parent.setAttributeNode(name_attr);
    child.classList.add("usageBtn_title");
    parent.classList.add("usageBtn");
    if (optionsObj[i].isDefault) {
      parent.classList.add("-defaultOption");
      parent.classList.add("--active");
    }
    if (optionsObj[i].writable) {
      parent.classList.add("-writable");
    }
    parent.appendChild(child);
    optionsContainer.appendChild(parent);
  }
}

//stepSluts: [{from:"",to:"",step:""},...]
function rangeSlider(rangeIndicator, stepSluts = [], callback = function() {}) {
  var rangeSlider = this;
  var mousedown = false;
  var rangeIndicator = document.getElementById(rangeIndicator);
  var inputRangeSlider = rangeIndicator.querySelector(".input-range_slider");
  var min = inputRangeSlider.getAttribute("aria-valuemin");
  var max = inputRangeSlider.getAttribute("aria-valuemax");
  var now = inputRangeSlider.getAttribute("aria-valuenow");
  var amountElement = rangeIndicator.querySelector(".loanAmountValue");
  var sliderElement = rangeIndicator.querySelector(
    ".input-range_slider-container"
  );
  var sliderTrack = rangeIndicator.querySelector(".input-range_track--active ");
  var sliderTrackBG = rangeIndicator.querySelector(".rangeSliderDOM_center");
  var step;
  if (typeof stepSluts !== "object" || stepSluts.length === 0) {
    stepSluts = [];
  }
  sliderElement.addEventListener(
    "touchstart",
    function(e) {
      mousedown = true;
    },
    true
  );
  sliderElement.addEventListener(
    "mousedown",
    function(e) {
      mousedown = true;
    },
    true
  );
  document.addEventListener(
    "mouseup",
    function(e) {
      mousedown = false;
    },
    true
  );
  document.addEventListener(
    "touchend",
    function(e) {
      mousedown = false;
    },
    true
  );
  function _updateSlider(newAmount, stepsObj, forceUpdate) {
    var amountRange = max - min;
    if (stepsObj.length > 0) {
      for (var i = 0; i < stepsObj.length; i++) {
        if (stepsObj[i].from <= newAmount && stepsObj[i].to > newAmount) {
          var stepBaseAmount = Math.round(
            Number(newAmount) / Number(stepsObj[i].step)
          );
          newAmount = stepBaseAmount * stepsObj[i].step;
          nextAmount = (stepBaseAmount + 1) * stepsObj[i].step;
          prevAmount = (stepBaseAmount - 1) * stepsObj[i].step;
        }
      }
    }
    var move = newAmount / amountRange;
    if (move >= 1) move = 1;
    if (move <= 0) move = 0;
    sliderTrack.style.width = Number(Math.ceil(move * 100)) + "%";
    sliderElement.style.left = Number(Math.ceil(move * 100)) + "%";
    inputRangeSlider.setAttribute("aria-valuenow", newAmount);
    amountElement.innerText = newAmount;
    rangeSlider.stepBack = function() {
      console.log("range element: ", this);
      _updateSlider(prevAmount, stepsObj, true);
    };
    rangeSlider.stepForward = function() {
      console.log("range element: ", this);
      _updateSlider(nextAmount, stepsObj, true);
    };
    callback(newAmount);
  }
  function _detectPosition(e, isTouch) {
    var x;
    if (isTouch) {
      x = e.touches[0].clientX;
    } else {
      x = e.clientX;
    }
    var moveX = x - sliderTrackBG.offsetLeft - sliderElement.offsetLeft;
    var newLeftPosition =
      (sliderElement.offsetLeft + moveX) / sliderTrackBG.clientWidth;
    var newAmount = 0;
    if (mousedown) {
      if (newLeftPosition <= 1 && newLeftPosition > 0) {
        newAmount = Number(min) + parseInt((max - min) * newLeftPosition);
        _updateSlider(newAmount, stepSluts, false);
      } else if (newLeftPosition >= 1) {
        newAmount = max;
        _updateSlider(newAmount, stepSluts, false);
      } else if (newLeftPosition <= 0) {
        newAmount = min;
        _updateSlider(newAmount, stepSluts, false);
      }
    }
  }
  document.addEventListener(
    "mousemove",
    function(e) {
      _detectPosition(e, false);
    },
    true
  );
  document.addEventListener(
    "touchmove",
    function(e) {
      _detectPosition(e, true);
    },
    true
  );
  _updateSlider(now, stepSluts, true);
}

var organizationValidation = function(number) {
  number = String(number).trim();
  if (number) {
    if (number.length !== 10 || Number(number) === "NaN") {
      return "Ange ditt korrekta Organisationsnummer (exampel : 5560160451)";
    } else {
      return "";
    }
  } else {
    return "Organisations nummer krävs";
  }
};

function submitForm() {
  var isFormValidArr = [];
  var url = "https://ponture.com/app/loan";
  var price = document
    .getElementsByName("priceRange")[0]
    .getAttribute("aria-valuenow");
  var month = document
    .getElementsByName("monthRange")[0]
    .getAttribute("aria-valuenow");
  var options = optionsArr;
  var otherDescription = document.getElementsByName(
    "otherOptionDescription"
  )[0];
  var otherDescElem = document.getElementById("otherOption_input");
  var organizationNumber = document.getElementsByName("organizationNumber")[0];
  var organNumberElem = document.getElementById("organizationNumber_input");
  ///////////////////// validations
  //other description
  if (options.indexOf("other") > -1) {
    if (otherDescription.value.trim().length === 0) {
      otherDescElem.classList.add("--invalid");
      isFormValidArr.add("otherDesc");
    } else {
      otherDescElem.classList.remove("--invalid");
      isFormValidArr.remove("otherDesc");
    }
  }
  //organization number validation
  var isOrganizationNumberValid = organizationValidation(
    organizationNumber.value
  );
  if (isOrganizationNumberValid.length > 0) {
    organNumberElem.classList.add("--invalid");
    organNumberElem.getElementsByClassName(
      "validation-message"
    )[0].innerText = isOrganizationNumberValid;
    isFormValidArr.add("organNum");
  } else {
    organNumberElem.classList.remove("--invalid");
    isFormValidArr.remove("organNum");
  }
  if (isFormValidArr.length === 0) {
    var need = options.join(",");
    var params = "?";
    params += "amount=" + price;
    params += "&amourtizationPeriod=" + month;
    params += "&need=" + need;
    if (options.indexOf("other") > -1) {
      params += "&needDescription=" + otherDescription.value;
    }
    params += "&organizationNo=" + organizationNumber.value;
    url = url + params;
    window.open(url, "_blank");
  }
}
//Prototypes
Array.prototype.remove = function(value) {
  if (this.indexOf(value) > -1) {
    this.splice(this.indexOf(value), 1);
    return this;
  } else {
    return this;
  }
};
Array.prototype.add = function(value) {
  this.push(value);
  return this;
};

//Do actions after page load
document.addEventListener("DOMContentLoaded", function() {
  fillUsageOptions(usageObj);
  for (var i = 0; i < usageBtns.length; i++) {
    usageBtns[i].onclick = function() {
      toggleOption(this, function(element, isActive) {
        var name = element.getAttribute("name");
        if (isActive) {
          optionsArr = optionsArr.add(name);
        } else {
          optionsArr = optionsArr.remove(name);
        }
      });
    };
  }
});
