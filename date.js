exports.getDate = function() {
    let today = new Date();

    var options = {
        weekDay:"long",
        day:"numeric",
        month:"long"
    };

    return today.toLocaleDateString("en-US",options)
}

exports.getDay = function(){
    let today = new Date()
     
    let options = {
        weekDay: "long"
    }

    return today.toLocaleDateString("en-US", options)
}