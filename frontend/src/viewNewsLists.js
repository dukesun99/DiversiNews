import React, { useEffect } from 'react';
import { Row, Col, Card } from 'antd';
import { Select, Slider, Tag, List, Layout, Spin } from 'antd';
import 'antd/dist/antd.css';
import './viewNewsLists.css';

const { Sider } = Layout;
const { Option } = Select;

function get_bias_image(bias) {
    return <img src={`/img/bias-${bias}.png`} />
}

function getData(input, sliderValue, setResultItemList, setDisplayLoading, selectedMethod, setShowItem, setResultBiasesImage, setPairwiseBiasDiff, selectedEncoder) {
    let requestOptions = {};
    requestOptions = {
        crossDomain: true,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "mode": "showresults", "idx": input, "lambda": sliderValue, "method": selectedMethod, "encoder": selectedEncoder})
    };

    setDisplayLoading(true);
    fetch('/apiii', requestOptions)
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            setResultItemList(data["search_results"]);
            setShowItem(data["query_item"]);
            setResultBiasesImage(data["encoded_image"]);
            setPairwiseBiasDiff(data["pairwise_bias_diff"]);
            // document.getElementsByClassName("embedview").contentDocument.location.reload(true);
        }).then(() => {
            setDisplayLoading(false);
        })
}

const marks = {
    0.10: {
        style: {
            color: '#000000',
        },
        label: <strong>Diversity</strong>,
    },
    0.20: {

    },
    0.30: {

    },
    0.40: {

    },
    0.50: {

    },
    0.60: {

    },
    0.70: {

    },
    0.80: {

    },
    0.90: {

    },
    1: {
        style: {
            color: '#000000',
        },
        label: <strong>Relevancy</strong>,
    },
};


export default () => {
    const [resultItemList, setResultItemList] = React.useState([]);

    const [sliderValue, setSliderValue] = React.useState(0.5);

    const [selectedMethod, setSelectedMethod] = React.useState("BC-Greedy");
    const allMethods = ["BC-Greedy", "BC-DualGreedy"];

    const [selectedEncoder, setSelectedEncoder] = React.useState("AnglE");
    const allEncoders = ["AnglE", "LLAMA 2", "Sentence-BERT"];

    const [displaySearchRsultsPanel, setDisplaySearchResultsPanel] = React.useState(true);

    const [displayLoading, setDisplayLoading] = React.useState(false);
    const [showItem, setShowItem] = React.useState({});
    const [resultBiasesImage, setResultBiasesImage] = React.useState("");
    const [pairwiseBiasDiff, setPairwiseBiasDiff] = React.useState(0.0);

    const urlParams = new URLSearchParams(window.location.search);
    let idx = urlParams.get('idx');

    useEffect(() => {
        getData(parseInt(idx), sliderValue, setResultItemList, setDisplayLoading, selectedMethod, setShowItem, setResultBiasesImage, setPairwiseBiasDiff, selectedEncoder);
    }, [sliderValue, selectedMethod, selectedEncoder]);

    return (

        <Layout style={{ height: "calc(100vh - 0px)", width: "99vw" }}>
            <div style={{ height: "100%", "width": "100vw", "position": "fixed", "top": 0, "left": 0, "right": 0, "bottom": 0, "backgroundColor": "white", "display": "block", "zIndex": 999, "opacity": 0.5, "visibility": (displayLoading ? "visible" : "hidden") }}>
                <div style={{ "textAlign": "center", "position": "relative", "top": "50%", "transform": "translateY(-50%)", "opacity": 1 }}>
                    <Spin tip="Communicating with backend server... This should not take longer than 10 seconds..." size="large">
                    </Spin>
                </div>

            </div>


            <Layout style={{ width: "99vw", minHeight: "calc(100vh - 0px)" }}>
                {
                    <Sider width={"30%"} theme={"light"}>
                        <Card
                            title={
                                <div>
                                    {/* News View */}
                                    <List.Item onClick={() => {
                                        // if (searchItem != undefined) {
                                        //     setClickedItem(item);
                                        //     getSentimentComparationVis(searchItem.url, item.url, setData, pruningConfig, setDisplayLoading);
                                        // } else {
                                        //     setSearchItem(item);
                                        // }
                                        // setShowURL(item.url);
                                    }}
                                        key={showItem.url}
                                        data-item={showItem}
                                        style={{ padding: "10px" }}
                                    >
                                        <List.Item.Meta
                                            title={<a href={showItem.url}>{showItem.title}</a>}
                                            description={
                                                <div>
                                                    {<div>{showItem.excerpt}</div>}
                                                    <div><strong>Ground Truth Bias:</strong> {get_bias_image(showItem.bias)}</div>
                                                    {/* <br />
                                            {item.url} */}
                                                    <div>
                                                        <Tag style={{ marginBottom: 5 }} color="geekblue">
                                                            <a href={showItem.media_domain}>{showItem.media_name}</a>
                                                        </Tag>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                </div>
                            }
                            style={{ height: "100%" }}
                            bodyStyle={{ padding: "0", height: "100%" }}
                        >{
                                <div>
                                    <iframe src={showItem.url} style={{ height: "80vh", width: "100%" }} className='embedview'></iframe>
                                </div>
                            }
                        </Card>
                    </Sider>
                }
                <Sider width={displaySearchRsultsPanel ? "70%" : "100%"} >
                    <Row style={{ height: "100%", width: "100%" }}>
                        <Col style={{ height: "100%", width: "100%" }}>
                            <Card
                                title={<div>
                                    Retrieval Results
                                    <Row justify="space-around" gutter={[16, 16]}>
                                        <Col span={6}>
                                            <Select defaultValue={selectedMethod} style={{ marginTop: 18, marginLeft: 30, marginRight: 30, width: "100%" }} onChange={(value) => { setSelectedMethod(value) }}>
                                                {
                                                    (() => {
                                                        let options = [];
                                                        allMethods.forEach((method) => {
                                                            options.push(<Option value={method}>{method}</Option>)
                                                        })
                                                        return options
                                                    })()
                                                }
                                            </Select>
                                        </Col>
                                        <Col span={6}>
                                            <Select defaultValue={selectedEncoder} style={{ marginTop: 18, marginLeft: 30, marginRight: 30, width: "100%" }} onChange={(value) => { setSelectedEncoder(value) }}>
                                                {
                                                    (() => {
                                                        let options = [];
                                                        allEncoders.forEach((method) => {
                                                            options.push(<Option value={method}>{method}</Option>)
                                                        })
                                                        return options
                                                    })()
                                                }
                                            </Select>
                                        </Col>
                                        <Col span={10} >
                                            <Slider
                                                marks={marks}
                                                step={0.2}
                                                defaultValue={sliderValue}
                                                max={1}
                                                min={0.1}
                                                tipFormatter={(value) => {
                                                    if (value == 1) {
                                                        return <div>Similarity Only</div>
                                                    }
                                                    return <div>lambda = {value}</div>
                                                }}
                                                onAfterChange={
                                                    (value) => {
                                                        setSliderValue(value);
                                                    }
                                                }
                                                style={{ marginTop: 18, marginLeft: 30, marginRight: 30 }} />
                                        </Col>
                                    </Row>
                                    <Row justify="space-around" >
                                        <Col span={24}>
                                            <img src={resultBiasesImage} style={{ width: "100%" }} alt="Article Bias Distribution" />
                                        </Col>
                                        {/* <Col span={4}>
                                            <div style={{ width: "100%", marginLeft: "auto" }}>Diff: {pairwiseBiasDiff.toFixed(2)}</div>
                                        </Col> */}
                                    </Row>

                                </div>
                                }
                                style={{ height: "100%" }}
                                bodyStyle={{ maxHeight: "85%", overflow: "auto", "paddingTop": 10 }}
                            >

                                {<List
                                    itemLayout="vertical"
                                    size="large"
                                    dataSource={resultItemList}
                                    renderItem={item => (
                                        <List.Item onClick={() => {
                                            // if (searchItem != undefined) {
                                            //     setClickedItem(item);
                                            //     getSentimentComparationVis(searchItem.url, item.url, setData, pruningConfig, setDisplayLoading);
                                            // } else {
                                            //     setSearchItem(item);
                                            // }
                                            // setShowURL(item.url);
                                        }}
                                            key={item.url}
                                            data-item={item}
                                        >
                                            <List.Item.Meta
                                                title={item.title}
                                                description={
                                                    <div>
                                                        {<div>{item.excerpt}</div>}
                                                        <div><strong>Ground Truth Bias:</strong> {get_bias_image(item.bias)}</div>
                                                        <Tag style={{ marginBottom: 5 }} color="cyan">Sim: {item.sim_score.toFixed(3)}</Tag>
                                                        {/* <br />
                                                {item.url} */}
                                                        <div>
                                                            <Tag style={{ marginBottom: 5 }} color="geekblue">
                                                                <a href={item.media_domain}>{item.media_name}</a>
                                                            </Tag>
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />}
                            </Card>
                        </Col>
                    </Row>
                </Sider>
            </Layout>
        </Layout >
    );
};