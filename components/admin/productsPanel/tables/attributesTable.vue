<template>
  <v-card class="mb-20 pa-8">
    <tables-header

      v-model="search"
    />
    <v-data-table
      :footer-props="{
        showFirstLastPage: true,
        firstIcon: 'mdi-arrow-collapse-left',
        lastIcon: 'mdi-arrow-collapse-right',
        itemsPerPageText: 'تعداد ردیف در هر صفحه',
        pageText: '',
        itemsPerPageAllText: 'همه'
      }"
      :headers="headers"
      :items="attributes"
      :search="search"
      class="elevation-1 data-table-width mt-30"
    >
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="getColor(item.status)"
          dark
        >
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-spacer />
          <v-dialog
            v-model="dialog"
            class="dialog-width"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="ma-30"
                v-bind="attrs"
                @click="addItem"
                v-on="on"
              >
                افزودن صفت
              </v-btn>
            </template>
            <v-card>
              <div>
                <v-row>
                  <v-col
                    class="form-elements-column-width"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      class="text-fields-size"
                      label="نام (اصلی)"
                    />
                  </v-col>
                  <v-col
                    class="form-elements-column-width"
                  >
                    <v-text-field
                      v-model="editedItem.farsiname"
                      class="text-fields-size"
                      label="نام قابل نمایش (فارسی)"
                    />
                  </v-col>
                  <v-col
                    class="form-elements-column-width"
                  >
                    <v-text-field
                      v-model="editedItem.controltype"
                      class="text-fields-size"
                      label="نوع کنترل صفت"
                    />
                  </v-col>
                </v-row>
              </div>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  انصراف
                </v-btn>
                <v-btn
                  v-if="changeshow"
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  ذخیره
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">
                آیا از حذف این صفت مطمئن هستید؟
              </v-card-title>
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" text @click="closeDelete">
                  انصراف
                </v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                  بله
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-row>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                class="mx-2 edit-delete-btns"
                fab
                dark
                x-small
                color="#9575CD"
                v-on="on"
                @click="editItem(item)"
              >
                <v-icon dark>
                  mdi-pencil
                </v-icon>
              </v-btn>
            </template>
            <span> تغییر صفت در دیالوگ</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                class="mx-2 edit-delete-btns"
                fab
                dark
                x-small
                color="#9575CD"

                :href="'products-coupons-attributes/attribute/' + item.id + '/edit'"
              >
                <v-icon dark>
                  mdi-pencil
                </v-icon>
              </v-btn>
            </template>
            <span> تغییر صفت </span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                class="mx-2 edit-delete-btns"
                fab
                dark
                x-small
                color="#455A64"
                v-on="on"
                @click="deleteItem(item)"
              >
                <v-icon dark>
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <span>حذف صفت</span>
          </v-tooltip>
        </v-row>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import TablesHeader from '~/components/admin/tablesHeader'
export default {
  name: 'AttributesTable',
  components: { TablesHeader },
  data: () => ({
    items: ['item1', 'item2', 'item3', 'item4'],
    switch1: false,

    changeshow: false,
    detailshow: false,
    search: '',
    dialog: false,

    dialogDelete: false,

    headers: [
      {
        text: 'نام (اصلی)',
        align: 'start',
        sortable: false,
        value: 'name'
      },
      { text: 'نام قابل نمایش (فارسی)', value: 'farsiname', sortable: false },
      { text: 'نوع کنترل صفت', value: 'controltype', sortable: false },
      { text: 'عملیات', value: 'actions', sortable: false }

    ],

    attributes: [],

    editedIndex: -1,

    editedItem: {
      name: '',
      farsiname: '',
      controltype: ''
    },

    defaultItem: {
      name: '',
      farsiname: '',
      controltype: ''
    }

  }),

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    addItem () {
      this.dialog = true
      this.changeshow = true
      this.detailshow = false
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    getColor (status) {
      if (status === 'فعال') {
        return 'green'
      } else {
        return 'red'
      }
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    editItem (item) {
      this.editedIndex = this.attributes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      this.changeshow = true
      this.detailshow = false
    },
    editItem2 (item) {
      this.$router.push('products-coupons-attributes/attribute/' + item.id + '/edit')
    },

    detailItem (item) {
      this.editedIndex = this.attributes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      this.detailshow = true
      this.changeshow = false
    },

    deleteItem (item) {
      this.editedIndex = this.attributes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.attributes.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.attributes[this.editedIndex], this.editedItem)
      } else {
        this.attributes.push(this.editedItem)
      }
      this.close()
    },
    initialize () {
      this.attributes = [
        {
          name: 'services',
          farsiname: 'خدمات دریافتی',
          controltype: 'GroupedCheckbox',
          id: 1
        },
        {
          name: 'wallet',
          farsiname: 'کیف پول',
          controltype: 'select',
          id: 2
        },
        {
          name: 'discount',
          farsiname: 'تخفیف',
          controltype: 'select',
          id: 3
        }
      ]
    }

  }
}
</script>

<style lang="scss" scoped>
@import url('~/assets/scss/components/admin/productsPanel/tables/attributesTable.scss');

</style>
