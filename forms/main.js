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
  { from: 100000, to: 200000, step: 15000 },
  { from: 200000, to: 400000, step: 25000 },
  { from: 400000, to: 1000000, step: 50000 },
  { from: 1000000, to: 5000000, step: 75000 },
  { from: 5000000, to: 7500000, step: 100000 },
  { from: 7500000, to: 10000000, step: 125000 }
];
document.addEventListener("DOMContentLoaded", function() {
  var defaultOption = document.getElementsByClassName("-defaultOption");
  var activeUsages = document.querySelectorAll(".usageBtn.--active");
  var usageBtns = document.getElementsByClassName("usageBtn");
  fillUsageOptions(usageObj);
  selectDefaultOption(activeUsages, defaultOption);
  rangeSlider("priceRange", priceStepsObj, function(price) {
    price = price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
    document.querySelector("#priceRange .loanAmountValue").innerText =
      price + " kr";
  });
  rangeSlider("monthRange", [{ from: 1, to: 36, step: 1 }], function(month) {
    if (month === "36") month = "+36 månader";
    else if (parseInt(month) === 1) month = month + " månad";
    else month = month + " månader";
    document.querySelector("#monthRange .loanAmountValue").innerText = month;
  });
  for (var i = 0; i < usageBtns.length; i++) {
    usageBtns[i].onclick = function() {
      toggleOption(this);
    };
  }
});

//functions
function toggleOption(e, callback) {
  e.classList.toggle("--active");
  var activeUsages = document.querySelectorAll(".usageBtn.--active");
  var defaultOption = document.getElementsByClassName("-defaultOption");
  if (e.classList.contains("-writable") && e.classList.contains("--active")) {
    document.getElementById("otherOption_input").style.display = "block";
  } else if (
    e.classList.contains("-writable") &&
    !e.classList.contains("--active")
  ) {
    document.getElementById("otherOption_input").style.display = "none";
  }
  selectDefaultOption(activeUsages, defaultOption);
}
function selectDefaultOption(activeOptions, defaultOptionDOM) {
  if (activeOptions.length === 0) {
    toggleOption(defaultOptionDOM[0]);
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
    }
    if (optionsObj[i].writable) {
      parent.classList.add("-writable");
    }
    parent.appendChild(child);
    optionsContainer.appendChild(parent);
  }
}

//stepSluts: [{from:"",to:"",step:""},...]
rangeSlider.prototype.next = function() {};
function rangeSlider(rangeIndicator, stepSluts = [], callback = function() {}) {
  var mousedown = false;
  var rangeIndicator = document.getElementById(rangeIndicator);
  var inputRangeSlider = rangeIndicator.querySelector(".input-range_slider");
  var min = inputRangeSlider.getAttribute("aria-valuemin");
  var max = inputRangeSlider.getAttribute("aria-valuemax");
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
  var _updateSlider = function(move, oldAmount, newAmount, stepsObj) {
    if (stepsObj.length > 0) {
      var amountRange = max - min;
      for (var i = 0; i < stepsObj.length; i++) {
        if (stepsObj[i].from <= newAmount && stepsObj[i].to > newAmount) {
          var stepBaseAmount = Math.round(
            Number(newAmount) / Number(stepsObj[i].step)
          );
          newAmount = stepBaseAmount * stepsObj[i].step;
          move = newAmount / amountRange;
        }
      }
    }
    sliderTrack.style.width = Number(Math.ceil(move * 100)) + "%";
    sliderElement.style.left = Number(Math.ceil(move * 100)) + "%";
    inputRangeSlider.setAttribute("aria-valuenow", newAmount);
    amountElement.innerText = newAmount;
    callback(newAmount);
  };
  var _detectPosition = function(e, isTouch) {
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
    var oldAmount = inputRangeSlider.getAttribute("aria-valuenow");
    if (mousedown) {
      if (newLeftPosition < 1 && newLeftPosition > 0) {
        newAmount = Number(min) + parseInt((max - min) * newLeftPosition);
        _updateSlider(newLeftPosition, oldAmount, newAmount, stepSluts);
      } else if (newLeftPosition === 1) {
        newAmount = max;
        _updateSlider(1, oldAmount, newAmount, []);
      } else if (newLeftPosition <= 0) {
        newAmount = min;
        _updateSlider(0, oldAmount, newAmount, []);
      }
    }
  };
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
}

var organizationValidation = function(number) {
  number = String(number).trim();
  if (number) {
    if (number.length !== 10 || Number(number)) {
      return "Ange ditt korrekta Organisationsnummer exampel : 556016-0451)";
    } else {
      return "";
    }
  } else {
    return "Organisations nummer krävs";
  }
};

function submitForm() {
  var range = document
    .getElementsByName("priceRange")[0]
    .getAttribute("aria-valuenow");
  var month = document
    .getElementsByName("monthRange")[0]
    .getAttribute("aria-valuenow");
  var options = document.querySelector("#usageOptions .usageBtn");
  var optionsDescription = document.getElementsByName(
    "otherOptionDescription"
  )[0].value;
  var organizationNumber = document.getElementsByName("organizationNumber")[0]
    .value;
}
