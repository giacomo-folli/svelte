<script lang="ts">
  import ComponentSubtitle from "../../../ComponentSubtitle.svelte";
  import PropsViewer from "../../PropsViewer.svelte";
  import SimpleTable, { type Header } from "$lib/components/simple/lists/SimpleTable.svelte";
  import Icon from "$lib/components/simple/media/Icon.svelte";
  import { DateTime } from "luxon";

  let resizedColumnSizeWithPadding: { [value: string]: number } | undefined = undefined

  let headers: Header[] = [
      // {
      //   value: 'true',
      //   label: 'New customer',
      //   type: 'checkbox',
      //   additionalParams :{
      //     checkboxColor:'white',
      //     checkboxSize:'2.1rem'
      //   }
      // },
       {
        value: 'active',
        label: 'Active',
        type: {
          key:'icon',
          params :{
            name:'mdi-check',
            color:'green',
            size:'2.1rem'
          }
        }
      },
      {
        value: 'businessName',
        label: 'Business name',
        type:   {
          key:"string"
        },
      }, {
        value: 'productName',
        label: 'Product Name',
        type:   {
          key:"string"
        },
        minWidth: '160px',
        sortable: true
      }, {
        value: 'progress',
        label: 'Progress',
        type:   {
          key:"string"
        }
      }, {
        value: 'rating',
        label: 'Rating',
        type:   {
          key:"custom"
        },
        sortable: true,
      },
      {
        value: 'startDate',
        label: 'Start date ',
        type: {
          key:'date',
          params :{
            locale: 'it',
            format: 'dd/MM/yyyy',
          }
        }
      },
      {
        value: 'activeDate',
        label: 'Active date [toLocaleString]',
        type: {
          key:'date',
          params :{
            locale: 'en',
            format: 'MM-dd-yy',
          }
        }
      },
      {
        value: 'endDate',
        label: 'End date ',
        type: {
          key:'date',
          params :{
            locale: 'it',
            format: "HH 'ore e' mm 'minuti",
          }
        }
      }
    ]

</script>

<h1>SimpleTable</h1>
<ComponentSubtitle>Grid beutiful view.</ComponentSubtitle>
<h2>Example</h2>
<div class="example">
  <SimpleTable
    resizableColumns={true}
    bind:resizedColumnSizeWithPadding
    {headers}
    items={[
      {
        businessName: 'GQ Creators',
        productName: 'Data Protection',
        progress: '339 sold',
        rating: 5,
        startDate: DateTime.now(),
        activeDate: DateTime.now(),
        endDate: DateTime.now(),
      }, {
        businessName: 'Dribblers Agency',
        productName: 'Job Search',
        progress: '212 sold',
        rating: 4.5,
        startDate: DateTime.now(),
        activeDate: DateTime.now(),
        endDate: DateTime.now(),
      }, {
        businessName: 'Popular My',
        productName: 'Financial Transactions',
        progress: '94 sold',
        rating: 4.2,
        startDate: DateTime.now(),
        activeDate: DateTime.now(),
        endDate: DateTime.now()
      },
    ]}
  >
      <svelte:fragment slot="custom" let:header let:item>
        {#if header.value == 'rating'}
          {item.rating}
          <Icon name="mdi-star" --icon-color="green"></Icon>
        {/if}
      </svelte:fragment>
      <svelte:fragment slot="append" let:index>
        {#if index == -1}
          Append
        {/if}
      </svelte:fragment>
      <svelte:fragment slot="rowActions">RowActions</svelte:fragment>
  </SimpleTable>
</div>
<h2>Props</h2>
<PropsViewer
  props={[
    // {
    //   name: 'type',
    //   type: '"button" | "submit"',
    //   description: "HTML type attribute",
    //   default: "button"
    // }
  ]}
  styleProps={[
    // {
    //   name: '--button-max-width',
    //   type: 'string',
    //   default: 'undefined',
    //   description: 'The max width of the outer element'
    // }
  ]}
></PropsViewer>
<h2>Slots</h2>
<h2>Events</h2>

<style>
  .example {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }
</style>