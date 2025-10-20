USE clinic;
SELECT 
    p.name AS patient_name,
    m.medication_name,
    ai.ingredient_name,
    al.allergy_name,
    pa.severity AS allergy_severity,
    oi.allergy_risk_detected,
    o.override_flag,
    o.override_reason
FROM orders o
JOIN patients p ON o.patient_id = p.patient_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN medications m ON oi.medication_id = m.medication_id
JOIN medication_ingredients mi ON m.medication_id = mi.medication_id
JOIN active_ingredients ai ON mi.ingredient_id = ai.ingredient_id
JOIN ingredient_allergy_map iam ON ai.ingredient_id = iam.ingredient_id
JOIN allergies al ON iam.allergy_id = al.allergy_id
JOIN patient_allergies pa ON pa.allergy_id = al.allergy_id 
    AND pa.patient_id = o.patient_id;
