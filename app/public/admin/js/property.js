(function ($) {
    'use strict';

    var propertyState = {};
    var refreshRequest = null;

    function rememberPropertyValues() {
        $('.name_select_rielt').each(function () {
            var $property = $(this);
            var propertyId = $property.attr('data-property');
            var $checkboxes = $property.find('.checkbox_property input[type="checkbox"]');

            if ($checkboxes.length) {
                propertyState[propertyId] = [];
                $checkboxes.filter(':checked').each(function () {
                    propertyState[propertyId].push(String($(this).val()));
                });
                return;
            }

            propertyState[propertyId] = $property.find('input.ag_pole_good, select.ag_pole_good').first().val();
        });
    }

    function restorePropertyValues() {
        $('.name_select_rielt').each(function () {
            var $property = $(this);
            var propertyId = $property.attr('data-property');
            var value = propertyState[propertyId];
            var $checkboxes;

            if (value === undefined) {
                return;
            }

            $checkboxes = $property.find('.checkbox_property input[type="checkbox"]');
            if ($checkboxes.length) {
                $checkboxes.each(function () {
                    $(this).prop('checked', $.inArray(String($(this).val()), value) !== -1);
                });
                return;
            }

            $property.find('input.ag_pole_good, select.ag_pole_good').first().val(value);
        });
    }

    // Выбор категории в товаре и обновление блока характеристик.
    $('body').on('change', '.js-category', function () {
        var category = [];
        var $properties = $('.property_all');

        $(this).closest('.add_good_name_category')
            .toggleClass('category_checked is-selected', this.checked);

        $('.js-category:checked').each(function () {
            category.push($(this).val());
        });

        if (refreshRequest) {
            refreshRequest.abort();
        }

        rememberPropertyValues();
        $properties.addClass('is-loading').attr('aria-busy', 'true');

        refreshRequest = $.ajax({
            type: 'POST',
            url: './admin/ajax/property/Refresh_Property_Good.php',
            dataType: 'html',
            data: { category: category },
            success: function (data) {
                $properties.html(data);
                restorePropertyValues();
            },
            error: function (xhr, status) {
                if (status === 'abort') {
                    return;
                }
                $properties.html('<div class="error-state">Не удалось обновить характеристики.</div>');
            },
            complete: function () {
                $properties.removeClass('is-loading').attr('aria-busy', 'false');
                refreshRequest = null;
            }
        });
    });
}(jQuery));
