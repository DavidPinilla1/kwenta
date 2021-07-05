import { Synth } from '@synthetixio/contracts-interface';
import { wei, WeiSource } from '@synthetixio/wei';
import { CurrencyKey } from 'constants/currency';
import { Query } from 'react-query';

// The function turns react query cached queries into a map (with the currencyKey) as the key to be used in the sorting.
export const toCurrencyKeyMap = (
	query: Query<unknown, unknown>[],
	dataField?: string
): Partial<Record<CurrencyKey, number>> =>
	query.reduce((acc, query) => {
		// the fourth item is the currencyKey (according to the queryKeys.ts file)
		const currencyKey = query.queryKey[3] as string;

		if (query.state.data != null) {
			// @ts-ignore
			acc[currencyKey] = dataField ? query.state.data[dataField] : query.state.data;
		}

		return acc;
	}, {});

export const numericSort = (
	comparatorMap: Partial<Record<CurrencyKey, WeiSource>>,
	a: Synth,
	b: Synth
) => {
	const valA = wei(comparatorMap[a.name as CurrencyKey] ?? 0);
	const valB = wei(comparatorMap[b.name as CurrencyKey] ?? 0);

	return valA.gt(valB) ? -1 : 1;
};
