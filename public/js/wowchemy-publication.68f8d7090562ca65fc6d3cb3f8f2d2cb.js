// Get the current URL path
const currentPath = window.location.pathname;

// Split the current path to get the first segment (folder)
const pathSegments = currentPath.split("/").filter((segment) => segment); // Removes empty segments
const firstFolder = pathSegments[0]; // Get the first folder

// Get all the nav links
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

// Loop through nav links
navLinks.forEach((link) => {
  // Get the target from data-target attribute
  const target = link.getAttribute("data-target");
  // Get the href from the link
  const href = link.getAttribute("href");

  // Check if target is not null or empty, then check if it matches firstFolder
  if (target && firstFolder === target.substring(1)) {
    link.classList.add("active"); // Add active class to the matching link
  }
  // If target is empty, check the href against the current path
  else if (!target && href && firstFolder === href.split("/")[1]) {
    link.classList.add("active"); // Add active class if href matches the first folder
  }
  // Remove active class if neither condition is met
  else {
    link.classList.remove("active"); // Remove active class from non-matching links
  }
});

// Function to replace empty href attributes
function replaceEmptyHrefs() {
  // Select all <a> elements
  const links = document.querySelectorAll('a[href=""], a[href="#"]');
  links.forEach((link) => {
    link.href = "javascript:void(0);";
  });

  // Select all <button> elements
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    if (button.hasAttribute("href") && button.getAttribute("href") === "") {
      button.href = "javascript:void(0);";
    }
  });
}

// Run the function to replace empty hrefs
replaceEmptyHrefs();

// ----------------------------------------------------------------

// var a = {},
//   c,
//   r,
//   l = $("#container-publications");
// if (l.length) {
//   l.isotope({
//     itemSelector: ".isotope-item",
//     percentPosition: !0,
//     layoutMode: "cellsByRow",
//     filter: function () {
//       let t = $(this),
//         i = c ? t.text().match(c) : !0,
//         o = r ? t.is(r) : !0;
//       return i && o;
//     },
//   });
//   let e = $(".filter-search").keyup(
//     p(function () {
//       (c = new RegExp(e.val(), "gi")), l.isotope();
//     })
//   );
//   $(".pub-filters").on("change", function () {
//     let i = $(this)[0].getAttribute("data-filter-group");
//     if (((a[i] = this.value), (r = f(a)), l.isotope(), i === "pubtype")) {
//       let o = $(this).val();
//       o.substr(0, 9) === ".pubtype-"
//         ? (window.location.hash = o.substr(9))
//         : (window.location.hash = "");
//     }
//   });
// }
// function p(e, t) {
//   let i;
//   return (
//     (t = t || 100),
//     function () {
//       clearTimeout(i);
//       let u = arguments,
//         n = this;
//       function s() {
//         e.apply(n, u);
//       }
//       i = setTimeout(s, t);
//     }
//   );
// }
// function f(e) {
//   let t = "";
//   for (let i in e) t += e[i];
//   return t;
// }
// function d() {
//   if (!l.length) return;
//   let e = window.location.hash.replace("#", ""),
//     t = "*";
//   e != "" && !isNaN(e) && (t = ".pubtype-" + e);
//   let i = "pubtype";
//   (a[i] = t), (r = f(a)), l.isotope(), $(".pubtype-select").val(t);
// }
