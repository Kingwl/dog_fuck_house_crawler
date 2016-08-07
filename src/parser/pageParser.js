let houseParser = require('./houseParser');

exports.haveContent = function ($) {
    return ($('.main').find('.list').length > 0);
}

exports.parsePage = function parsePage($) {
    let houses = [];

    if ($('.main').find('.list').length > 0) {
        let house_list_node = $('.main').find('.list').first();
        house_list_node.children().each(function (i, elem) {
            let house_node = $(this);
            houses.push(houseParser($, house_node));
        })
    }

    return houses;
}