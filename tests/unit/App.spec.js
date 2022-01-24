import { createLocalVue, mount } from '@vue/test-utils'
import App from "@/App";
import Vuex from 'vuex';
import {state,getters} from '@/store'

describe("App.vue", () => {
    function mountComponent() {
        const localVue = createLocalVue();
        localVue.use(Vuex)

        return mount(App, {
            localVue,
            store: new Vuex.Store({
                state: JSON.parse(JSON.stringify(state)),
                getters
            })
        })
    }
    let wrapper

    beforeEach(() => {
        wrapper = mountComponent()
    })
    it("component should exist", () => {
        expect(wrapper.exists()).toBeTruthy()
    })

    it('h1 element exists check', () => {
        expect(wrapper.find('h1').exists()).toBeTruthy()
    })

    it('h1 element text equal to check', () => {
        expect(wrapper.find('h1').text()).toEqual("Daily Corona Cases in Turkey")
    })

    it.each`
    caseName | countValue | expectedStyle
    ${'when count equal to 13'} | ${13} | ${"danger"}
    ${'when count equal to 9'} | ${9} | ${"normal"}
    ${'when count equal to 2'} | ${2} | ${"safe"}
    `('returns $expectedStyle when $caseName with $countValue',
    async ({caseName, countValue, expectedStyle}) => {
        wrapper.vm.$store.state.count = countValue
        await wrapper.vm.$nextTick()
        const element = wrapper.find(".notificationArea")
        expect(element.classes()).toContain(expectedStyle)
    })

    it.each`
    caseName | countValue | expectedStyle
    ${'when count equal to 13'} | ${13} | ${`Danger!!! Case count is ${13}k`}
    ${'when count equal to 9'} | ${9} | ${`Life is normal. Case count is ${9}k`}
    ${'when count equal to 2'} | ${2} | ${`So safe. Case count is ${2}k`}
    `('returns $expectedStyle when $caseName',
    async ({caseName, countValue, expectedStyle}) => {
        wrapper.vm.$store.state.count = countValue
        await wrapper.vm.$nextTick()
        const element = wrapper.find(".notificationArea").text()
        expect(element).toEqual(expectedStyle)
    })   
})