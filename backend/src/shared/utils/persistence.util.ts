// Utilidades para guardar con TypeORM usando INSERT/UPDATE directos.
// Se usan en lugar de repository.save() porque save() compara el registro
// con el de la base de datos antes de guardar, y en algunos casos termina
// en "UpdateValuesMissingError". insert()/update() van directo a la tabla.

/** Quita las propiedades con valor undefined (no se envían a la BD). */
export const withoutUndefined = <T extends object>(data: T): Partial<T> =>
  Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) as Partial<T>;

/** True si el objeto no tiene nada que guardar. */
export const isEmpty = (data: object): boolean => Object.keys(data).length === 0;
