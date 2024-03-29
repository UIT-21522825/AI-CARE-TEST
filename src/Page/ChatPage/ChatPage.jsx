import { useEffect, useState } from "react";
import { Button, Avatar } from "antd";
import { request } from "./";
import { SendOutlined } from "@ant-design/icons";
import { CustomParagraph } from "./antd-custom/CustomTypography";
import { CustomMessage } from "./antd-custom/CustomMessage";
import { motion } from "framer-motion";
import { getMessageHistory } from "./helper";
import { useFormik } from "formik";

export const ChatPage = () => {
  const _id = localStorage.getItem("_id");
  const username = localStorage.getItem("username");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState([]);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [conversationTemp, setConversationTemp] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [firstChat, setFirstChat] = useState(true);

  const formik = useFormik({
    initialValues: {
      input: input,
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async function (values) {
      setInput("");
      setFirstChat(false);

      const words = username.split(" ");
      const _username = words.length > 1 ? words[words.length - 1] : words[0]; //ten
      setMessage(values.input);
      setLoading(true);
      conversation.push({ role: "user", content: values.input });
      setConversation(conversation);

      request(
        "post",
        "api/chatgpt/confide",
        {
          message: values.input,
          userID: _id,
          _username: _username,
          // + ". hãy cho tôi lời khuyên dưới vai trò là nhà tâm lý học."
        }
        //   {
        //     // timeout: 5000, // Override the default timeout for this request
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   }
      )
        .then((res) => {
          conversation.push({ role: "assistant", content: res.data });
          setConversation(conversation);
          setLoading(false);
          setInput(null);
          try {
            if (res && res.status !== 200) {
              CustomMessage(
                { content: "Lỗi hệ thống! Vui lòng thử lại sau 1" },
                "error"
              );
              setError(true);
            } else {
              setResponse(res.data);
            }
          } catch (e) {
            CustomMessage(
              { content: "Lỗi hệ thống! Vui lòng thử lại sau 2" },
              "error"
            );
            setError(true);
          }
        })
        .catch((e) => {
          CustomMessage(
            { content: "Lỗi hệ thống! Vui lòng thử lại sau 3" },
            "error"
          );
          setError(true);
        });

      //   .catch((error) =>
      //     CustomMessage("Lỗi hệ thống! Vui lòng thử lại sau", "error")
      //   );

      // api/chatgpt/chat
    },
  });
  useEffect(function () {
    async function load() {
      const MessagePromise = getMessageHistory(_id);
      //import.meta.env.VITE_firstPrompt
      MessagePromise.then(function (res) {
        setFirstChat(false);

        const extracted = res.data.slice();

        setConversation(extracted);
      }).catch(function (error) {
        setFirstChat(true);
        console.log(error);
      });
    }

    load();
  }, []);
  const handleChange = (event) => {
    setInput(event.target.value);
  };
  const sendMessage = async (data) => {
    setFirstChat(false);

    const words = username.split(" ");
    const _username = words.length > 1 ? words[words.length - 1] : words[0]; //ten
    setMessage(data.message);
    setLoading(true);
    conversation.push({ role: "user", content: data.message });
    setConversation(conversation);

    request(
      "post",
      "api/chatgpt/confide",
      {
        message: data.message,
        userID: _id,
        _username: _username,
        // + ". hãy cho tôi lời khuyên dưới vai trò là nhà tâm lý học."
      }
      //   {
      //     // timeout: 5000, // Override the default timeout for this request
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
    )
      .then((res) => {
        console.log(res);
        conversation.push({ role: "assistant", content: res.data });
        setConversation(conversation);
        setLoading(false);
        setInput(null);
        console.log(conversation);
        try {
          if (res && res.status !== 200) {
            CustomMessage(
              { content: "Lỗi hệ thống! Vui lòng thử lại sau 1" },
              "error"
            );
            setError(true);
          } else {
            setResponse(res.data);
          }
        } catch (e) {
          CustomMessage(
            { content: "Lỗi hệ thống! Vui lòng thử lại sau 2" },
            "error"
          );
          setError(true);
        }
      })
      .catch((e) => {
        CustomMessage(
          { content: "Lỗi hệ thống! Vui lòng thử lại sau 3" },
          "error"
        );
        setError(true);
      });

    //   .catch((error) =>
    //     CustomMessage("Lỗi hệ thống! Vui lòng thử lại sau", "error")
    //   );

    // api/chatgpt/chat
  };
  return (
    <div className="flex flex-wrap h-full w-full items-center pt-10 justify-center gap-2 mt-12">
      <div className="grid auto-rows-auto w-full h-full p-3 mb-16 content-end">
        <motion.div
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 1,
            ease: "linear",
            duration: 1,
            x: { duration: 1 },
          }}
          className="w-full float-left"
        >
          <>
            <p className="font-medium text-gray-500 mb-1">EmotiBot</p>
            <div className="flex flex-wrap">
              <div className="flex w-full gap-3">
                <Avatar src="https://img.freepik.com/free-vector/cute-dog-robot-cartoon-character-animal-technology-isolated_138676-3143.jpg?w=740&t=st=1684998540~exp=1684999140~hmac=0b223d11d39b69aaaf8905c8858e60a3ed43da8c7c1fba5c4e5811832ae48f98" />
                <CustomParagraph className="shadow rounded-xl bg-secondary min-h-12 font-medium w-fit p-3 container text-black">
                  Xin chào. Tôi có thể giúp gì cho bạn?
                </CustomParagraph>
              </div>
            </div>
          </>

          <>
            {conversation?.map((item, index) => {
              if (index >= 3 && item.role === "user") {
                return (
                  <div key={index} className="w-full float-right">
                    <p className="font-medium text-black mb-1 text-end">You</p>
                    <div className="flex justify-end gap-3">
                      <CustomParagraph className="shadow text-black rounded-xl bg-gray-300 min-h-12 font-medium p-3 container w-fit float-right">
                        {item.content}
                      </CustomParagraph>
                      <Avatar>U</Avatar>
                    </div>
                  </div>
                );
              } else if (index >= 4 && item.role === "assistant") {
                return (
                  <div key={index} className="w-full float-left">
                    <p className="font-medium text-gray-500 mb-1">EmotiBot</p>
                    <div className="flex flex-wrap">
                      <div className="flex w-full gap-3">
                        <Avatar src="https://img.freepik.com/free-vector/cute-dog-robot-cartoon-character-animal-technology-isolated_138676-3143.jpg?w=740&t=st=1684998540~exp=1684999140~hmac=0b223d11d39b69aaaf8905c8858e60a3ed43da8c7c1fba5c4e5811832ae48f98" />
                        <CustomParagraph className="shadow rounded-xl bg-secondary min-h-12 font-medium w-fit p-3 container text-black">
                          {item.content}
                        </CustomParagraph>
                      </div>
                    </div>
                  </div>
                );
              }
              return null; // Return null for any other role
            })}
          </>
        </motion.div>
      </div>

      {isLoading && (
        <>
          <div className="w-full float-left">
            <p className="font-medium text-gray-500 mb-1">EmotiBot</p>
            <div className="flex flex-wrap">
              <div className="flex w-full gap-3">
                <Avatar src="https://img.freepik.com/free-vector/cute-dog-robot-cartoon-character-animal-technology-isolated_138676-3143.jpg?w=740&t=st=1684998540~exp=1684999140~hmac=0b223d11d39b69aaaf8905c8858e60a3ed43da8c7c1fba5c4e5811832ae48f98" />
                {!error ? (
                  <CustomParagraph className="shadow rounded-xl bg-gray-300 min-h-12 font-medium p-3 w-fit animate-pulse text-gray-500">
                    Đang phân tích
                  </CustomParagraph>
                ) : (
                  <CustomParagraph className="shadow rounded-xl bg-error min-h-12 font-medium w-fit p-3 container text-black">
                    Lỗi. Vui lòng thử lại sau
                  </CustomParagraph>
                )}
              </div>
              {/* <div className="flex justify-center w-full">
                <Button
                  type="outline"
                  onClick={clearConservation}
                  size="large"
                  className="bg-white/[0.8] rounded-xl shadow"
                >
                  {response || error ? (
                    <>
                      <RedoOutlined /> Tiếp tục
                    </>
                  ) : (
                    <>
                      <StopOutlined className="text-error" /> Dừng hội thoại
                    </>
                  )}
                </Button>{' '}
              </div> */}
            </div>
          </div>
        </>
      )}

      <form
        name="chatbox"
        onSubmit={formik.handleSubmit}
        onChange={handleChange}
        autoComplete="off"
        className=" z-10 relative h-fit bottom-0 flex align-center gap-2 w-full p-3 bg-white/[0.8] shadow"
      >
        {!isLoading ? (
          <input
            {...formik.getFieldProps("input")}
            placeholder="Nhập tâm tư"
            size="large"
            className="relative shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-grey-darker leading-tight rounded-xl"
          />
        ) : (
          <input
            value={input}
            placeholder="Nhập tâm tư"
            size="large"
            className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-grey-darker leading-tight rounded-xl"
          />
        )}

        {!isLoading && input ? (
          <Button
            type="submit"
            htmlType="submit"
            size="large"
            className="bg-[#11009E] rounded-full shadow text-white"
          >
            <SendOutlined />
          </Button>
        ) : (
          <Button
            type="outline"
            htmlType="submit"
            size="large"
            className="bg-[#11009E] rounded-full shadow text-gray-300"
            disabled
          >
            <SendOutlined />
          </Button>
        )}
      </form>
    </div>
  );
};
