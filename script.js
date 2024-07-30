// const { default: axios } = require("axios");

const prayers = document.getElementsByClassName("prayer_time");
const hDate = document.getElementById("hDate");
const mDate = document.getElementById("mDate");
const clock = document.getElementById("clock");
const selectOfCountry = document.getElementById("countries");
const selectOfCity = document.getElementById("cities");
const cityNameLable = document.getElementById("city");

const setSelectedCountry = () => {
  const countries = [
    {
      arabicName: "السعودية",
      name: "SA",
      cities: [
        { arabicName: "الرياض", name: "Riyadh" },
        { arabicName: "مكة المكرمة", name: "Makkah" },
        { arabicName: "المدينة المنورة", name: "Medina" },
        { arabicName: "جدة", name: "Jeddah" },
        { arabicName: "الدمام", name: "Ad Dammam" },
        { arabicName: "أبها", name: "Abha" },
      ],
    },
  ];

  for (country of countries) {
    const template = `
    <option value=${country.name}>${country.arabicName}</option>
    `;
    selectOfCountry.innerHTML += template;

    for (city of country.cities) {
      const cTempalte = ` <option value=${city.name}>${city.arabicName}</option>`;
      selectOfCity.innerHTML += cTempalte;
    }
  }
};

const getColck = () => {
  axios
    .get(`http://api.aladhan.com/v1/currentTime?zone=Asia/Riyadh`)
    .then((res) => {
      clock.innerHTML = res.data.data;
    });
};
const fillTime = (id, time) => {
  document.getElementById(id).innerHTML = time;
};

const getTiming = (country, city) => {
  axios
    .get(
      `http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}`
    )
    .then((res) => {
      const timings = res.data.data;
      mDate.innerHTML = timings.date.gregorian.weekday.en;
      mDate.innerHTML += `<span style="
      margin-left: 12px;">${timings.date.gregorian.date}</span>`;
      hDate.innerHTML = `<span style="
      margin-left: 12px; ">${timings.date.hijri.date}</span>`;
      hDate.innerHTML += timings.date.hijri.weekday.ar;

      /* /////// ALSO SOULTION ////// */
      // let timeList = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
      // for (let i = 0; i < prayers.length; i++) {
      //   prayers[i].innerHTML += `<div>${timings.timings[timeList[i]]}</div>`;
      // }

      fillTime("fajr_time", timings.timings.Fajr);
      fillTime("sunrise_time", timings.timings.Sunrise);
      fillTime("duhuir_time", timings.timings.Dhuhr);
      fillTime("asr_time", timings.timings.Asr);
      fillTime("magrib_time", timings.timings.Maghrib);
      fillTime("isha_time", timings.timings.Isha);
    })
    .catch((e) => {
      console.log(e);
    });
};

getColck();
setInterval(() => {
  getColck();
}, 20000);
setSelectedCountry();

// init call of getTiming
getTiming("SA", "Riyadh");

// to catch any chage in selection and change the value of timing and city name
selectOfCity.addEventListener("change", function () {
  getTiming("SA", this.value);
  cityNameLable.innerHTML = this.options[this.selectedIndex].text;
});
