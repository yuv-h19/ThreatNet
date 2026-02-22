$(document).ready(function() {
    // Parse URL parameters to check for operation status
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('success') === 'true') {
        $("#points-popup").fadeIn(400, function() {
            $(this).animate({ marginTop: "-10px" }, 200).animate({ marginTop: "0px" }, 200);

            setTimeout(function() {
                $("#points-popup").fadeOut(400);
            }, 1000);
        });

        // Clean the URL parameters to prevent repeat triggers on page refresh
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});