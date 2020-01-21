var usageObj = [
  {
    API_Name: "general_liquidity",
    Label: "Generell likviditet",
    isDefault: false
  },
  {
    API_Name: "hire_staff",
    Label: "Anställa personal",
    isDefault: false
  },
  {
    API_Name: "purchase_renting_equipment",
    Label: "Köpa / hyra utrustning",
    isDefault: false
  },
  {
    API_Name: "renovation",
    Label: "Renovering",
    isDefault: false
  },
  {
    API_Name: "website_marketing",
    Label: "Webbplats/Marknadsföring",
    isDefault: false
  },
  {
    API_Name: "renting_premises",
    Label: "Hyra lokal",
    isDefault: false
  },
  {
    API_Name: "unexpected_expenses",
    Label: "Oväntade utgifter",
    isDefault: false
  },
  {
    API_Name: "pay_off_debts",
    Label: "Betala av skulder",
    isDefault: false
  },
  {
    API_Name: "purchase_of_inventory",
    Label: "Köpa lager",
    isDefault: false
  },
  {
    API_Name: "seasonal_financing",
    Label: "Säsongsfinansiering",
    isDefault: false
  },
  {
    API_Name: "application_for_permit",
    Label: "Ansökan om tillstånd",
    isDefault: false
  },
  {
    API_Name: "construction_project",
    Label: "Byggnationsprojekt",
    isDefault: false
  },
  {
    API_Name: "expansion",
    Label: "Expansion",
    isDefault: false
  },
  {
    API_Name: "purchase_of_business",
    Label: "Företagsförvärv",
    isDefault: false
  },
  {
    API_Name: "purchase_of_real_estate",
    Label: "Köp av fastighet",
    isDefault: false
  },
  {
    API_Name: "switch_loan",
    Label: "Lösa/Byta lån",
    isDefault: false
  },
  {
    API_Name: "loan_consolidation",
    Label: "Samla lån",
    isDefault: false
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
    if (month === 36) month = "+36 månader";
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
  var min = parseInt(inputRangeSlider.getAttribute("aria-valuemin"));
  var max = parseInt(inputRangeSlider.getAttribute("aria-valuemax"));
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

  var _updateSlider = function(newAmount, stepsObj, forceUpdate) {
    var amountRange = max;
    var minMove = min / amountRange;
    var maxMove = (max - min) / amountRange;
    var move = 0;
    var step = minMove;
    if (stepsObj.length > 0) {
      for (var i = 0; i < stepsObj.length; i++) {
        if (stepsObj[i].from <= newAmount && stepsObj[i].to > newAmount) {
          step = stepsObj[i].step;
          var stepBaseAmount = Math.round(Number(newAmount) / Number(step));
          newAmount = stepBaseAmount * step;
          if (newAmount < max) nextAmount = (stepBaseAmount + 1) * step;
          if (newAmount > min) prevAmount = (stepBaseAmount - 1) * step;
        }
      }
    }
    if (newAmount > min) move = Math.trunc((newAmount / amountRange) * 98);
    sliderTrack.style.width = move + "%";
    sliderElement.style.left = move + "%";
    inputRangeSlider.setAttribute("aria-valuenow", newAmount);
    amountElement.innerText = newAmount;
    rangeSlider.stepBack = function() {
      if (newAmount !== min) _updateSlider(newAmount - step, stepSluts, true);
    };
    rangeSlider.stepForward = function() {
      if (newAmount !== max) _updateSlider(newAmount + step, stepSluts, true);
    };
    callback(newAmount);
  };
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
      if (newLeftPosition <= 1 && newLeftPosition >= 0) {
        newAmount = Number(min) + parseInt((max - min) * newLeftPosition);
        _updateSlider(newAmount, stepSluts, false);
      } else if (newLeftPosition > 1) {
        newAmount = max;
        _updateSlider(newAmount, stepSluts, false);
      } else if (newLeftPosition < 0) {
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

var inputValidation = function(type, value) {
  var msgTxt = "";
  switch (type) {
    case "email":
      var regex = new RegExp(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      );
      if (value.length > 0) {
        if (!regex.test(value)) {
          msgTxt = "Felaktig e-post. Ange ditt e-post.";
        } else {
          msgTxt = "";
        }
      } else {
        msgTxt = "Fältet är obligatoriskt.";
      }
      break;
    case "phone":
      var regex = new RegExp(
        /^(\+?46|0|0046)[\s\-]?[1-9][\s\-]?[0-9]([\s\-]?\d){6,7}$/
      );
      if (value.length > 0) {
        if (!regex.test(value)) {
          msgTxt = "Felaktig telefon. Ange ditt telefon.";
        } else {
          msgTxt = "";
        }
      } else {
        msgTxt = "Fältet är obligatoriskt.";
      }
      break;
    case "organizationNumber":
      var regex = new RegExp(/^([0-9]){6}-?([0-9]){4}$/);
      if (value.length > 0) {
        if (!regex.test(value)) {
          msgTxt =
            "Ange ditt korrekta organisationsnummer (exampel : 5560160451).";
        } else {
          msgTxt = "";
        }
      } else {
        msgTxt = "Ditt organisationsnummer krävs.";
      }
      break;
    default:
      break;
  }
  return msgTxt;
};
function urlParser(url) {
  let regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }
  return params;
}
function submitForm() {
  var isFormValidArr = [];
  var url = "https://www.ponture.com/app/loan";
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
  var organNumberElem = document.getElementById("organizationNumber_input");
  var emailElem = document.getElementById("email_input");
  var phoneElem = document.getElementById("phone_input");
  var organizationNumber = document.getElementsByName("organizationNumber")[0];
  var email = document.getElementsByName("email")[0];
  var phone = document.getElementsByName("phone")[0];
  var urlParams = urlParser(window.location.href);
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
  var isOrganizationNumberValid = inputValidation(
    "organizationNumber",
    organizationNumber.value
  );
  var isEmailValid = inputValidation("email", email.value);
  var isPhoneValid = inputValidation("phone", phone.value);
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
  if (isEmailValid.length > 0) {
    emailElem.classList.add("--invalid");
    emailElem.getElementsByClassName(
      "validation-message"
    )[0].innerText = isEmailValid;
    isFormValidArr.add("email");
  } else {
    emailElem.classList.remove("--invalid");
    isFormValidArr.remove("email");
  }

  if (isPhoneValid.length > 0) {
    phoneElem.classList.add("--invalid");
    phoneElem.getElementsByClassName(
      "validation-message"
    )[0].innerText = isPhoneValid;
    isFormValidArr.add("phone");
  } else {
    phoneElem.classList.remove("--invalid");
    isFormValidArr.remove("phone");
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
    params += "&email=" + email.value;
    params += "&phoneNumber=" + phone.value;

    //UTMs
    params +=
      "&utm_source=krogdirekt&utm_medium=onlineform&utm_campaign=spartner&utm_content=appform";
    // params += urlParams.utm_source ? "&utm_source=" + urlParams.utm_source : "";
    // params += urlParams.utm_medium ? "&utm_medium=" + urlParams.utm_medium : "";
    // params += urlParams.utm_campaign
    //   ? "&utm_campaign=" + urlParams.utm_campaign
    //   : "";
    // params += urlParams.utm_content
    //   ? "&utm_content=" + urlParams.utm_content
    //   : "";

    //Redirecting
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
