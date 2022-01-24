import { shallowMount, createLocalVue } from '@vue/test-utils'
import Counter from "@/Counter";
import Vuex from 'vuex';
import { actions, mutations, getters, state } from "@/store";

describe("Counter.vue", () => {
    function mountComponent() {
        const localVue = createLocalVue()
        localVue.use(Vuex)

        return shallowMount(Counter, {
            localVue,
            store: new Vuex.Store({
                state: JSON.parse(JSON.stringify(state)),
                getters,
                mutations,
                actions
            })
        });
    }

    let wrapper

    beforeEach(() => {
        wrapper = mountComponent()
    })
    it("component should exist", () => {
        expect(wrapper.exists()).toBeTruthy()
    })
    it("increase button should exist", () => {
        const button = wrapper.findAll('button').filter(n => n.text().match('Increase'))
        expect(button.exists()).toBeTruthy()
    })
    it("decrease button should exist", () => {
        const button = wrapper.findAll('button').filter(n => n.text().match('Decrease'))
        expect(button.exists()).toBeTruthy()
    })

    it("decrease button delegates properly", async () => {
        let dispatchMock = jest.fn()

        const wrapper = shallowMount(Counter, {
            mocks: {
                $store: {
                    state,
                    dispatch: dispatchMock
                }
            }
        })
        const button = wrapper.findAll('button').filter(n => n.text().match('Decrease'))
        await button.trigger('click')
        expect(dispatchMock).toHaveBeenCalledWith('decrement')
    })

    it("increase button delegates properly", async () => {
        let dispatchMock = jest.fn()

        const wrapper = shallowMount(Counter, {
            mocks: {
                $store: {
                    state,
                    dispatch: dispatchMock
                }
            }
        })
        const button = wrapper.findAll('button').filter(n => n.text().match('Increase'))
        await button.trigger('click')
        expect(dispatchMock).toHaveBeenCalledWith('increment')
    })


    it('when 2 increase + decrease functionality check together', async () => {
        let increaseButton = wrapper.findAll('button').filter(n => n.text().match('Increase'))
        let decreaseButton = wrapper.findAll('button').filter(n => n.text().match('Decrease'))
        await increaseButton.trigger("click")
        await increaseButton.trigger("click")
        await decreaseButton.trigger("click")
        expect(wrapper.vm.$store.state.count).toEqual(1)
    })


    it('Count text show check', () => {
        const wrapper = mountComponent(Counter)
        const countText = wrapper.find('span').text()
        expect(countText).toEqual(`${wrapper.vm.$store.state.count}k`)
    })
})


