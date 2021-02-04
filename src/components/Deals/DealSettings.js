import React, { Component } from 'react';
import { Tabs, Checkbox } from 'antd';
import { deal, profile } from '../../actions';

const { getDealTypes } = deal;
const { getUserDealCategory, userDealCategoryInsertion, userDealCategoryRemoval } = profile;
const { TabPane } = Tabs;

class DealSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    onChange = async (e, tab_id, category_id, sub_category_id, all = false) => {
        
        const data = [...this.state.data];
        const tab = data.find(tab => tab.id === tab_id);
        if (tab) {
            const obj = {
                category: null,
                sub_categories: []
            };
            
            const categoryIndex = tab.categories.findIndex(category => category.id === category_id);
            if (categoryIndex >= 0) {
                
                let category;
                if (!all) {
                    let subCategory;
                    const subCategoryIndex = tab.categories[categoryIndex].sub_categories.findIndex(sub_ctg => sub_ctg.id === sub_category_id);
                    if (subCategoryIndex >= 0) {
                        
                        subCategory = {
                            ...tab.categories[categoryIndex].sub_categories[subCategoryIndex]
                        };
                        
                        subCategory.checked = e.target.checked;
                        tab.categories[categoryIndex].sub_categories[subCategoryIndex] = subCategory;
                    }

                    const res = tab.categories[categoryIndex].sub_categories.filter(sub_ctg => sub_ctg.checked === true)
                    if (tab.categories[categoryIndex].sub_categories.length === res.length) {
                        
                        category = {
                            ...tab.categories[categoryIndex]
                        }
                        category.checked = true;
                    } else {
                        category = {
                            ...tab.categories[categoryIndex]
                        }
                        category.checked = false;
                    }
                    obj.category = category.id;
                    obj.sub_categories.push(subCategory.id);
                } else {
                    category = {
                        ...tab.categories[categoryIndex]
                    };
                    category.sub_categories.forEach(sub_ctg => {
                        sub_ctg.checked = e.target.checked;
                    });
                    category.checked = e.target.checked;
                    obj.category = category.id;
                    obj.sub_categories = category.sub_categories.map(sub_ctg => sub_ctg.id);
                }
                tab.categories[categoryIndex] = category;
            }
            
            this.setState({
                data
            });

            if (e.target.checked) {
                await userDealCategoryInsertion(obj);
            } else {
                await userDealCategoryRemoval(obj);
            }
        }
    }

    async componentDidMount() {

        const res = await getUserDealCategory();
        
        const result = await getDealTypes();

        if (result.status === 200 && res.status === 200) {
    
            const data = [];

            result.data.types.forEach(tp => {

                const tab = {
                    id: null,
                    name: null,
                    categories: [],
                };

                tab.id = tp.deal_type_id;
                tab.name = tp.description;

                tp.deal_categories.forEach(ctg => {

                    const category = {
                        id: null,
                        name: null,
                        checked: false,
                        sub_categories: [],
                    };

                    let checkArr = res.data.user_deal_category.filter(dt => dt.deal_category_id === ctg.deal_category_id)

                    category.id = ctg.deal_category_id;
                    category.name = ctg.description;
                    
                    ctg.deal_sub_categories.forEach(sub_ctg => {

                        const sub_category = {
                            id: null,
                            name: null,
                            checked: false
                        };

                        sub_category.id = sub_ctg.deal_sub_category_id;
                        sub_category.name = sub_ctg.description;
                        sub_category.checked = checkArr.find(elem => elem.deal_sub_category_id === sub_ctg.deal_sub_category_id) ? true : false;
                        
                        category.sub_categories.push(sub_category);
                    });

                    if (category.sub_categories.length)
                        category.checked = checkArr.length === category.sub_categories.length;
                    else
                        category.checked = checkArr.find(elem => elem.deal_category_id === ctg.deal_category_id) ? true : false;

                    tab.categories.push(category);
                });

                data.push(tab);
            });

            this.setState({
                data
            });

        }
        
    }

    render() {

        return (
            <div className="card-container">
                <Tabs type="card">
                    
                    { this.state.data.map(tab => (
                        <TabPane tab={tab.name} key={tab.id}>
                            { tab.categories.map(category => (
                                <>
                                    <div style={{ borderBottom: '1px solid #E9E9E9', padding: 10, backgroundColor: 'antiquewhite' }}>
                                        <Checkbox
                                            key={category.id}
                                            onChange={e => this.onChange(e, tab.id, category.id, null, true)}
                                            checked={category.checked}
                                        >
                                            {category.name}
                                        </Checkbox>
                                    </div>
                                    <br />
                                    { category.sub_categories.map(sub_category => (
                                        <Checkbox
                                            key={sub_category.id}
                                            onChange={e => this.onChange(e, tab.id, category.id, sub_category.id)}
                                            checked={sub_category.checked}
                                            style={{ margin: '0 15px 15px 15px' }}
                                        >
                                            {sub_category.name}
                                        </Checkbox>
                                    ))}
                                    
                                </>
                            )) }
                            
                            
                        </TabPane>
                    ))}
                </Tabs>
            </div>
        )
    }
}

export default DealSettings;