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
document.addEventListener("DOMContentLoaded", function() {
  fillUsageOptions(usageObj);
  rangeSlider("priceRange");
  rangeSlider("monthRange");
  var defaultOption = document.getElementsByClassName("-defaultOption");
  var activeUsages = document.querySelectorAll(".usageBtn.--active");
  var usageBtns = document.getElementsByClassName("usageBtn");
  for (var i = 0; i < usageBtns.length; i++) {
    usageBtns[i].onclick = function() {
      toggleOption(this);
    };
  }
  selectDefaultOption(activeUsages, defaultOption);
});

//functions
function toggleOption(e) {
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
function submitForm() {}
function rangeSlider(rangeIndicator, stepSluts) {
  var mousedown = false;
  var rangeIndicator = document.getElementById(rangeIndicator);

  var sliderElement = rangeIndicator.querySelector(
      ".input-range_slider-container"
    ),
    sliderTrack = rangeIndicator.querySelector(".input-range_track--active "),
    sliderTrackBG = rangeIndicator.querySelector(".rangeSliderDOM_center"),
    x = 0,
    y = 0,
    mousedown = false;

  sliderElement.addEventListener(
    "mousedown",
    function(e) {
      mousedown = true;
      x = sliderElement.offsetLeft - e.clientX;
      y = sliderElement.offsetTop - e.clientY;
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
    "mousemove",
    function(e) {
      var moveX =
        e.clientX - sliderTrackBG.offsetLeft - sliderElement.offsetLeft;
      var newLeftPosition =
        ((sliderElement.offsetLeft + moveX) / sliderTrackBG.clientWidth) * 100;
      if (mousedown && newLeftPosition < 100 && newLeftPosition > 0) {
        sliderTrack.style.width = newLeftPosition + "%";
        sliderElement.style.left = newLeftPosition + "%";
      }
    },
    true
  );
}
