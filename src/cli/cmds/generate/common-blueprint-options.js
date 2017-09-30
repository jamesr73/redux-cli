/*
  Get common options to be added to every blueprint command.

  Always return a new object so that individual blueprint defaults/settings
  can be set.
*/
const getCommonOptions = () => ({
  path: {
    alias: 'P',
    description: 'set __path__ for this blueprint',
    normalize: true,
    required: true
  }
});

export default getCommonOptions;
