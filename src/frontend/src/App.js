import {useState, useEffect} from "react";
import {deleteStudent, getAllStudents} from "./client";
import {
    DesktopOutlined,
    FileOutlined,
    LoadingOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    PlusOutlined
} from '@ant-design/icons';
import {Breadcrumb, Empty, Layout, Menu, Spin, Table, Button, Badge, Avatar, Radio, Popconfirm} from 'antd';
import StudentDrawerForm from "./StudentDrawerForm";
import {errorNotification, successNotification} from "./Notification";

const {Header, Content, Footer, Sider} = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Option 1', '1', <PieChartOutlined/>),
    getItem('Option 2', '2', <DesktopOutlined/>),
    getItem('User', 'sub1', <UserOutlined/>, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined/>, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined/>),
];

const TheAvatar = ({name}) => {
    if (name.trim().length === 0) {
        return <Avatar icon={<UserOutlined />}/>
    }
    const split = name.trim().split(" ");
    if (split.length === 1) {
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>
        {`${split[0].charAt(0)}${split[1].charAt(0)}`}
    </Avatar>
}

const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then(() => {
        successNotification("Student deleted", `Student with ID:${studentId} was deleted`)
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                `${res.error}`,
                `${res.message} [status code: ${res.status}]`);
        });
    })
}

const columns = fetchStudents => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'Avatar',
        render: (text, student) => <TheAvatar name={student.name}/>
    },
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, student) =>
            <Radio.Group>
                <Popconfirm
                    placement="topRight"
                    title={`Are you sure to delete ${student.name}`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button value="small">Edit</Radio.Button>
            </Radio.Group>
    }
];

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
);

function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchStudents = () =>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setStudents(data);
                setFetching(false);
            }).catch(err => {
                console.log(err.response)
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification(
                        `${res.error}`,
                        `${res.message} [status code: ${res.status}]`);
                });
            }).finally(() => setFetching(false))

    useEffect(() => {
        console.log("component is mounted");
        fetchStudents();
    }, []);

    const renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon}/>;
        }

        if (students.length <= 0) {
            return <>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                    Add New Student
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
            </>
        }
        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
            <Badge.Ribbon text={"Number of students: " + students.length}>
                <Table
                    dataSource={students}
                    columns={columns(fetchStudents)}
                    bordered
                    title={() =>
                        <>
                            <Button
                                onClick={() => setShowDrawer(!showDrawer)}
                                type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                                Add New Student
                            </Button>
                        </>
                    }
                    pagination={{pageSize: 50}}
                    scroll={{y: 350}}
                    rowKey={(student) => student.id}
                />
            </Badge.Ribbon>
        </>
    }

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="logo"/>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}/>
            </Sider>
            <Layout className="site-layout">
                <Header
                    className="site-layout-background"
                    style={{
                        padding: 0,
                    }}
                />
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            minHeight: 360,
                        }}
                    >
                        {renderStudents()}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    By Shanming Li
                </Footer>
            </Layout>
        </Layout>
    );
}

export default App;
