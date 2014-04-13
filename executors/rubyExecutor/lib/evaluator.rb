class Evaluator
  attr_accessor :code

  def initialize(code)
    @code = code
  end

  def evaluate!
    begin
      {ok: true, result: eval(code).inspect}
    rescue Exception => error
      {ok: false, errors: [error.message.inspect]}
    end
  end
end
