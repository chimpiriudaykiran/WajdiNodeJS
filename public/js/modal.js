function openModal(element, event) {
  event.preventDefault();

  let filename = $(element).attr("data-filename");

  let modal = $("#modal");

  modal.find(".modal-body p").load(filename, function (response, status, xhr) {
    if (status === "error") {
      $("#modal-error").html("Error: " + xhr.status + " " + xhr.statusText);
    } else {
      $(".js-download-cite").attr("href", filename);
    }
  });

  modal.modal("show");
}

function copyCitation(element, event) {
  event.preventDefault();

  let citationText = document.querySelector("#modal .modal-body p").innerHTML;

  navigator.clipboard
    .writeText(citationText)
    .then(function () {
      element.innerText = "Copied";
      console.debug("Citation copied!");

      let toastElement = document.getElementById("customToast");
      toastElement.style.display = "block";

      setTimeout(function () {
        toastElement.style.display = "none";
      }, 2000);

      setTimeout(function () {
        element.innerText = "Copy";
      }, 2000);

      $("#modal").modal("hide");
    })
    .catch(function (err) {
      console.error("Citation copy failed!", err);
    });
}
