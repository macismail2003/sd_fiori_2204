sap.ui.define([
	"sap/ui/table/Table"
], function (Table) {
	return Table.extend("sap.cc.control.CopyPasteTable", {
		onInit: function () {

		},
		insertRows: function (value, table, model, startRowIndex, startProperty) {

			// var that = this;
			var rows = value.split(/\n/);
			for (var i = 0; i < rows.length; i++) {
				rows[i] = rows[i].replace(/[\n\r]+/g, '');
			}
			rows = rows.filter(function (e) {
				return e;
			});
			var cells = table.getColumns();
			var templateItem = [];
			var itemsPath = table.getBindingPath('rows');
			var itemsArray = table.getModel(model).getProperty(itemsPath);
			var startPropertyIndex = 0;
			var model = table.getModel(model);
			if (startRowIndex === undefined) {
				startRowIndex = 0;
			}
			for (var int = 0; int < cells.length; int++) {
				var cell_element = cells[int];
				// var path = cell_element.getAggregation('template').getBindingPath('value');
				var path = cell_element.getAggregation('template').getBindingPath('value');
				if (!path) {
					path = cell_element.getAggregation('template').getBindingPath('text');
				}
				templateItem.push(path);
				if (path === startProperty) {
					startPropertyIndex = int;
				}

			}

			for (int = 0; int < rows.length; int++) {
				var rows_element = rows[int];
				cells = rows_element.split(/\t/);

				var originalObject = model.getProperty(itemsPath + "/" + startRowIndex++);
				if (originalObject === undefined) {
					originalObject = {};
					for (var k = 0; k < templateItem.length; k++) {
						originalObject[templateItem[k]] = undefined;
					}
					itemsArray.push(originalObject);
				}

				var lesserLength = Math.min(templateItem.length, (cells.length + startPropertyIndex));
				for (var int2 = startPropertyIndex, intValue = 0; int2 < lesserLength; int2++, intValue++) {
					var name = templateItem[int2];
					originalObject[name] = cells[intValue];

				}

			}

			var oData = model.getData().items;
			for (var i = 0; i < oData.length; i++) {
				oData[i].ItemNo = (i + 1);
			}

			if (oData.length > 10) {
				table.setVisibleRowCount(10);
			} else {
				table.setVisibleRowCount(oData.length);
			}

			model.refresh();

		},
		onAfterRendering: function () {
			// debugger;
			var that = this;
			Table.prototype.onAfterRendering.apply(this, arguments);
			this.attachBrowserEvent('paste', function (e) {
				e.preventDefault();
				var text = (e.originalEvent || e).clipboardData.getData('text/plain');
				// console.log(text);
				that.insertRows(text, this, undefined);
			});
			this.getAggregation('rows').forEach(function (row) {
				row.getCells().forEach(function (cell) {
					cell.attachBrowserEvent('paste', function (e) {
						e.stopPropagation();

						e.preventDefault();
						var text = (e.originalEvent || e).clipboardData.getData('text/plain');
						// console.log(text);
						var domCell = jQuery.sap.domById(e.currentTarget.id);
						var insertCell = jQuery('#' + domCell.id).control()[0];
						var itemsPath = that.getBindingPath('items');
						if (!itemsPath) {
							itemsPath = that.getBindingPath('rows');
						}
						var pathRow = insertCell.getBindingContext().sPath;
						var startRowIndex = pathRow.split(itemsPath + "/")[1];
						var startProperty = insertCell.getBindingPath('value');
						that.insertRows(text, that, undefined, startRowIndex, startProperty);
					});
				});
			});

		},
		renderer: Table.prototype.getRenderer()

	});
});