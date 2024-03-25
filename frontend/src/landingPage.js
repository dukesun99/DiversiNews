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

function getData(setResultItemList, setDisplayLoading) {
    let requestOptions = {};
    requestOptions = {
        crossDomain: true,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "mode": "samplequeries"})
    };

    setDisplayLoading(true);
    fetch('/apiii', requestOptions)
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            setResultItemList(data["search_results"]);
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
    0.30: {

    },
    0.50: {

    },
    0.70: {

    },
    0.90: {

    },
    1: {
        style: {
            color: '#000000',
        },
        label: <strong>Similarity</strong>,
    },
};


export default () => {
    const [resultItemList, setResultItemList] = React.useState([]);

    const [sliderValue, setSliderValue] = React.useState(0.5);

    const [selectedMethod, setSelectedMethod] = React.useState("BC-Greedy");
    const allMethods = ["BC-Greedy", "BC-DualGreedy"];

    const [displaySearchRsultsPanel, setDisplaySearchResultsPanel] = React.useState(true);

    const [displayLoading, setDisplayLoading] = React.useState(false);
    const [showItem, setShowItem] = React.useState({});

    useEffect(() => {
        getData(setResultItemList, setDisplayLoading);
    }, []);

    return (

        <Layout style={{ height: "calc(100vh - 0px)", width: "99vw" }}>
            <div style={{ height: "100%", "width": "100vw", "position": "fixed", "top": 0, "left": 0, "right": 0, "bottom": 0, "backgroundColor": "white", "display": "block", "zIndex": 999, "opacity": 0.5, "visibility": (displayLoading ? "visible" : "hidden") }}>
                <div style={{ "textAlign": "center", "position": "relative", "top": "50%", "transform": "translateY(-50%)", "opacity": 1 }}>
                    <Spin tip="Communicating with backend server... This should not take longer than 10 seconds..." size="large">
                    </Spin>
                </div>

            </div>

            <Row style={{ height: "100%", width: "100%" }}>
                <Col style={{ height: "100%", width: "100%" }}>
                    <Card
                        title={<div>
                            Discover News
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
                                    key={item.idx}
                                    data-item={item}
                                >
                                    <List.Item.Meta
                                        title={<a href={"/view?idx=" + item.idx}>{item.title}</a>}
                                        description={
                                            <div>
                                                {/* {<div>{item.excerpt}</div>} */}
                                                {/* <div><strong>Ground Truth Bias:</strong> {get_bias_image(item.bias)}</div> */}
                                                {/* <Tag style={{ marginBottom: 5 }} color="cyan">Sim: {item.sim_score.toFixed(3)}</Tag> */}
                                                {/* <br />
                                                {item.url} */}
                                                <div>
                                                    <Tag style={{ marginBottom: 5 }} color="geekblue">
                                                        <a href={item.media_domain}>{item.media_name}</a>
                                                    </Tag>
                                                    <p>{String(item.is_good)}</p>
                                                    <p>{String(item.avg_diffs)}</p>
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
        </Layout>
    );
};