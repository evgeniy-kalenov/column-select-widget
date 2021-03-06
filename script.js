"use strict";
{
    var rows = $.ajax({url: 'objects.txt', async: false}).responseText;
    if(rows){
        rows = JSON.parse(rows);
    }

    var selectedRows = [],
        notSelectedRows = [];

    for(var row in rows){
        var row = rows[row];
        if(row.selected === true){
            selectedRows.push(row);
        } else {
            notSelectedRows.push(row);
        }
    }

    var displayedTable = $('.col-table.col-table__displayed').DataTable({
        paging:   false,
        info:     false,
        scrollY:        "300px",
        scrollCollapse: true,
        data: notSelectedRows,
        "columns": [
            {data: "name"}
        ]
    });
    var test = displayedTable.row().node();
    $(test).addClass('ready');

    var setTable = $('.col-table.col-table__set').DataTable({
        paging:   false,
        info:     false,
        scrollY:        "300px",
        scrollCollapse: true,
        data: selectedRows,
        columns: [
            {data: "name"}
        ]
    });

    var activeTable = setTable,
        inactiveTable = displayedTable;


    $('.column-select-widget table tbody').on('click', 'tr', function () {
        var tr = $(this),
            parentTable = tr.closest('.col-table');

        if(parentTable.hasClass('col-table__set')){
            activeTable = setTable;
            inactiveTable = displayedTable;
        } else {
            activeTable = displayedTable;
            inactiveTable = setTable;
        }

        if (tr.hasClass('selected')) {
            tr.removeClass('selected');
        } else {
            inactiveTable.$('tr.selected').removeClass('selected');
            tr.addClass('selected');
        }
    } );

    $('.column-select-widget .event-btn_add').click(function () {
        var rows = activeTable.rows('.selected').data().toArray();

        // для коррктного сохранения конфигурации меняем значение selected на противопроложное
        for(var row in rows){
            rows[row].selected = !rows[row].selected;
        }

        activeTable.rows('.selected').remove().draw();
        inactiveTable.rows.add(rows).draw();
    });

    $('.column-select-widget .event-btn_up, .column-select-widget .event-btn_down').click(function () {
        var rows = activeTable.$('.selected'),
            isDownAction = $(this).hasClass('event-btn_down'),
            tableRowsLength = activeTable.$('tr').length;

        rows.each(function(index, element)
        {
            var rowIdx = element.rowIndex - 1,
                rowIdxSiblings = isDownAction ? rowIdx + 1 : rowIdx - 1;

            if(rowIdxSiblings < 0){
                rowIdxSiblings = tableRowsLength - 1;
            } else if(rowIdxSiblings > tableRowsLength - 1) {
                rowIdxSiblings = 0;
            }

            var currentElement = activeTable.row('tr:eq(' + rowIdx + ')'),
                currentElementData = currentElement.data();

            var prevElement = activeTable.row('tr:eq(' + rowIdxSiblings + ')'),
                prevElementData = prevElement.data();

            currentElement.data(prevElementData);
            $(currentElement.node()).removeClass('selected');

            prevElement.data(currentElementData);
            $(prevElement.node()).addClass('selected');

        });
    });

    $('.column-select-widget .event-btn_save').click(function () {
        var selectRows = setTable.rows().data().toArray(),
            notSelectRows = displayedTable.rows().data().toArray();

        var config = selectRows.concat(notSelectRows);
        config = JSON.stringify(config);

        alert("Сохраняем json: \n\n" + config);
    });
}