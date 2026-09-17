<?php

function renderProperty(PDO $connection, $property)
{
    $idProp = h($property['id']);
    $name = h($property['name_prop']);
    $place = '';

    if ($property['place_prop'] !== '') {
        $place = '<div class="field-help">' . h($property['place_prop']) . '</div>';
    }

    $fieldStart = '<div class="property-field name_select_rielt" data-property="' . $idProp
        . '" data-property-id="' . $idProp . '">'
        . '<div class="field-label name">' . $name . '</div>'
        . $place;

    if ($property['type_prop'] == '1') {
        return $fieldStart
            . '<input type="text" class="text-input add-inp ag_pole_good" placeholder="' . $name . '">'
            . '</div>';
    }

    if ($property['type_prop'] == '2') {
        $answers = propertyAnswers($connection, $property['id']);
        $options = '<option value="">Не выбрано</option>';

        foreach ($answers as $answer) {
            $options .= '<option value="' . h($answer['id']) . '">' . h($answer['answer_prop']) . '</option>';
        }

        return $fieldStart
            . '<select class="text-input ag_pole_good">' . $options . '</select>'
            . '</div>';
    }

    if ($property['type_prop'] == '3') {
        $answers = propertyAnswers($connection, $property['id']);
        $checkboxes = '';

        foreach ($answers as $answer) {
            $answerId = h($answer['id']);
            $checkboxes .= '<label class="choice line_chek">'
                . '<input type="checkbox" value="' . $answerId . '">'
                . '<span class="ckeck_param" data-val="' . $answerId . '">' . h($answer['answer_prop']) . '</span>'
                . '</label>';
        }

        return $fieldStart
            . '<div class="choice-grid checkbox_property ag_pole_good">' . $checkboxes . '</div>'
            . '</div>';
    }

    if ($property['type_prop'] == '4') {
        return $fieldStart
            . '<input type="text" inputmode="decimal" class="text-input add-inp ag_pole_good" placeholder="Числовое значение">'
            . '</div>';
    }

    return '';
}

function propertyAnswers(PDO $connection, $propertyId)
{
    $statement = $connection->prepare(
        'SELECT id, answer_prop FROM property_answer_s WHERE id_prop = ? ORDER BY sort_answer, id'
    );
    $statement->execute(array($propertyId));

    return $statement->fetchAll();
}
