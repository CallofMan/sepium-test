(function ($) {
    'use strict';

    function collectCategories() {
        var cats = [];

        $('.js-category:checked').each(function () {
            cats.push($(this).closest('.add_good_name_category').attr('data-category-chpu'));
        });

        return cats;
    }

    function collectPropertyValues() {
        var propertyMas = {};

        $('.name_select_rielt').each(function () {
            var $property = $(this);
            var propertyId = $property.attr('data-property');
            var $checkboxes = $property.find('.checkbox_property input[type="checkbox"]');
            var selected = [];
            var value;

            if ($checkboxes.length) {
                $checkboxes.filter(':checked').each(function () {
                    selected.push(String($(this).val()));
                });
                value = selected.join(':::');
            } else {
                value = $property.find('input.ag_pole_good, select.ag_pole_good').first().val();
            }

            if (value !== undefined && value !== '') {
                propertyMas[propertyId] = String(value);
            }
        });

        return propertyMas;
    }

    $('body').on('click', '.addgood_click', function () {
        var $button = $(this);

        $button.prop('disabled', true).text('Проверяем…');

        $.ajax({
            type: 'POST',
            url: './admin/ajax/Preview_Good_Payload.php',
            dataType: 'json',
            data: {
                cats: collectCategories(),
                property_mas: collectPropertyValues()
            },
            success: function (data) {
                $('.js-payload-preview').text(JSON.stringify(data, null, 2));
            },
            error: function () {
                $('.js-payload-preview').text('Не удалось проверить отправку.');
            },
            complete: function () {
                $button.prop('disabled', false).text('Проверить отправку');
            }
        });
    });
}(jQuery));
