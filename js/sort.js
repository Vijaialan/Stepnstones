/*
$(function () {
    sort(0, 'asc');
});
*/

function sort(colindex, ascdesc) {
    var tbod = $(".sort_table tbody");
    var rows = tbod.find("tr");
    console.log(rows);
    rows.sort(function (a, b) {
        var A = $.trim($(a).find("td").eq(colindex).text().toLowerCase());
        var B = $.trim($(b).find("td").eq(colindex).text().toLowerCase());

        if (!isNaN(A) && !isNaN(B)) {
            A = Number(A);
            B = Number(B);

            return ascdesc == 'asc' ? A - B : B - A;
        }

        if (isDate(A) && isDate(B)) {
            A = new Date(A);
            B = new Date(B);
            // console.log(B);

            return ascdesc == 'asc' ? Number(A) - Number(B):Number(B) - Number(A);
        }

        var multi = (ascdesc == 'asc') ? 1 : -1;

        A = A.replace(/\s\s+/g, ' ');
        B = B.replace(/\s\s+/g, ' ');

        if (A === B)
            return 0;
        else if (A === null)
            return 1;
        else if (B === null)
            return -1;
        else
            return String(A).localeCompare(String(B)) * multi;
    });
    console.log(rows);
    $.each(rows, function (index, ele) {
        // console.log(ele);
        tbod.append(ele);
    });
}

$(".sortable").click(function () {
    // alert("sort");
    var o = $(this).hasClass('asc') ? 'desc' : 'asc';
    $('.sortable').removeClass('asc').removeClass('desc');
    $(this).addClass(o);

    var colIndex = $(this).prevAll().length;

    sort(colIndex, o);
});

function isDate(x) {
    //return (null != x) && !isNaN(x) && ("undefined" !== typeof x.getDate);
    if (null != x && isNaN(x)) {
        var temp = new Date(x);
        return !isNaN(temp.getDate());
    }

    return 0;
}
