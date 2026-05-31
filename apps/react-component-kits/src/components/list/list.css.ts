import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

export const listContainer = recipe({
  base: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
  },
  variants: {
    direction: {
      row: { flexDirection: 'row' },
      column: { flexDirection: 'column' },
    },
  },
  defaultVariants: {
    direction: 'column',
  },
});

export type ListVariants = NonNullable<RecipeVariants<typeof listContainer>>;
