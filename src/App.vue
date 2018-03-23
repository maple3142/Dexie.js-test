<template>
	<div>
		<div style="float: right;">
			<p>This is a <a href="http://dexie.org/">Dexie.js</a> test</p>
			<p>Data: <a href="https://api.wynncraft.com/public_api.php?action=itemDB&category=all">WynnCraft items db</a></p>
			<p>Source code: <a href="https://github.com/maple3142/Dexie.js-test">Dexie.js-test</a></p>
		</div>
		<div>
			<div>
				Name: <input type="text" v-model="filters.name">
			</div>
			<div>
				Level: <input type="number" v-model.number="filters.mnlevel" min="0" :max="filters.mxlevel"> ~ <input type="number" v-model.number="filters.mxlevel" :min="filters.mnlevel" max="100">
			</div>
			<div>
				Type: 
				<select v-model="filters.type">
					<option v-for="t in TYPE" :key="t" :value="t">{{t}}</option>
				</select>
			</div>
			<div>
				Tier:
				<select v-model="filters.tier">
					<option v-for="t in TIER" :key="t" :value="t">{{t}}</option>
				</select>
			</div>
		</div>
		<div>
			<table>
				<thead>
					<th v-for="k in KEYS" :key="k">{{k}}</th>
				</thead>
				<tbody>
					<tr v-for="it in items" :key="it.name">
						<td v-for="k in KEYS" :key="k">{{it[k]}}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script>
import Dexie from 'dexie'

//update db.json: curl -k "https://api.wynncraft.com/public_api.php?action=itemDB&category=all" > src/db.json
const getData = () =>
	import('./db.json').then(r =>
		r.items.map(x => {
			if (x.accessoryType) {
				x.type = x.accessoryType
				delete x.accessoryType
			}
			return x
		})
	)

const db = new Dexie('db')
db.version(1).stores({
	items: 'name,[type+tier+level]'
})
window.db = db
export default {
	data() {
		return {
			TIER: ['Normal', 'Unique', 'Set', 'Rare', 'Legendary', 'Mythic'],
			TYPE: [
				'Spear',
				'Wand',
				'Dagger',
				'Bow',
				'Helmet',
				'Chestplate',
				'Leggings',
				'Boots',
				'Ring',
				'Necklace',
				'Bracelet'
			],
			KEYS: ['name', 'type', 'level', 'tier'],
			filters: {
				type: 'Wand',
				tier: 'Legendary',
				mnlevel: 0,
				mxlevel: 100,
				name: ''
			}
		}
	},
	storage: {
		namespace: 'App',
		keys: ['filters.type', 'filters.tier', 'filters.mnlevel', 'filters.mxlevel', 'filters.name']
	},
	async created() {
		if ((await db.items.count()) === 0) {
			await db.items.bulkAdd(await getData())
		}
	},
	asyncComputed: {
		async items() {
			const { name, type, tier, mnlevel, mxlevel } = this.filters
			const ln = name.toLowerCase()
			return await db.items
				.where(['type', 'tier', 'level'])
				.between([type, tier, mnlevel], [type, tier, mxlevel], true, true)
				.filter(x => x.name.toLowerCase().includes(ln))
				.toArray()
		}
	}
}
</script>
