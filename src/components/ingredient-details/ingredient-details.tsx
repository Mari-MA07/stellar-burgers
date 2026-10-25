import { IngredientDetailsUI, Preloader } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const { items } = useSelector((state) => state.ingredients);

  if (!items || items.length === 0) {
    return <Preloader />;
  }

  const ingredientData = items.find((item) => item._id === id);

  if (!ingredientData) {
    return <p className="text text_type_main-medium">Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
