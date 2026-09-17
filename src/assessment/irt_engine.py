import math

class IRTEngine:
    """
    2-Parameter Logistic (2PL) Item Response Theory Engine.
    Estimates answer probability and updates student ability score (theta) dynamically.
    """

    @staticmethod
    def calculate_probability(theta: float, difficulty: float, discrimination: float = 1.0) -> float:
        """
        Calculates P(theta) = 1 / (1 + e^(-a * (theta - b)))
        where theta = ability, b = difficulty, a = discrimination.
        """
        exponent = -discrimination * (theta - difficulty)
        # Prevents math range overflow
        exponent = max(-20.0, min(20.0, exponent))
        return 1.0 / (1.0 + math.exp(exponent))

    @classmethod
    def update_theta(
        cls,
        current_theta: float,
        difficulty: float,
        is_correct: bool,
        discrimination: float = 1.0,
        learning_rate: float = 0.25
    ) -> float:
        """
        Updates student ability score (theta) using online Stochastic Gradient Descent:
        theta_new = theta_old + lr * (response - P(theta_old))
        """
        p_success = cls.calculate_probability(current_theta, difficulty, discrimination)
        actual_response = 1.0 if is_correct else 0.0

        theta_delta = learning_rate * (actual_response - p_success)
        updated_theta = current_theta + theta_delta

        # Standard IRT range bounds [-3.0, 3.0]
        return round(max(-3.0, min(3.0, updated_theta)), 4)

    @staticmethod
    def update_concept_mastery(
        current_mastery: float,
        is_correct: bool,
        item_difficulty: float,
        weight: float = 0.15
    ) -> float:
        """
        Adjusts concept mastery score [0.0 to 1.0].
        Harder questions yield larger mastery increases on correct answers.
        """
        # Scale difficulty weight from [-3, 3] range to [0.5, 1.5]
        difficulty_factor = 1.0 + (item_difficulty / 3.0) * 0.5

        if is_correct:
            delta = weight * difficulty_factor * (1.0 - current_mastery)
        else:
            delta = -weight * (1.0 / difficulty_factor) * current_mastery

        new_mastery = current_mastery + delta
        return round(max(0.0, min(1.0, new_mastery)), 3)